import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// =============== Contact Settings ===============
app.get('/api/contact-settings', async (_req, res) => {
  try {
    let settings = await prisma.contactSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      // create default empty settings
      settings = await prisma.contactSettings.create({
        data: {
          id: 1,
          phoneNumber: '',
          whatsappNumber: '',
          emailAddress: '',
        },
      });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const contactSchema = z.object({
  phoneNumber: z.string(),
  whatsappNumber: z.string(),
  emailAddress: z.string().email(),
});

app.put('/api/contact-settings', async (req, res) => {
  const parse = contactSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parse.error.errors });
  }
  try {
    const updated = await prisma.contactSettings.upsert({
      where: { id: 1 },
      update: parse.data,
      create: { id: 1, ...parse.data },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============== Catalog Management ===============

const uploadDir = path.join(__dirname, '..', 'uploads', 'catalogs');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// Get current catalog
app.get('/api/catalog/current', async (_req, res) => {
  try {
    const current = await prisma.catalogFile.findFirst({ where: { isCurrent: true }, orderBy: { uploadedAt: 'desc' } });
    if (!current) return res.status(404).json({ message: 'No catalog set as current' });
    res.json(current);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new catalog
app.post('/api/catalog', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File required' });
  const { version } = req.body as { version?: string };
  try {
    const created = await prisma.catalogFile.create({
      data: {
        fileUrl: `/uploads/catalogs/${req.file.filename}`,
        fileName: req.file.originalname,
        version: version || null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update catalog flags
app.patch('/api/catalog/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { isCurrent } = req.body as { isCurrent?: boolean };
  try {
    if (isCurrent) {
      // reset previous current
      await prisma.catalogFile.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
    }
    const updated = await prisma.catalogFile.update({ where: { id }, data: { isCurrent: Boolean(isCurrent) } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete catalog
app.delete('/api/catalog/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.catalogFile.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ message: 'Catalog not found' });
    // delete file from disk
    const absolute = path.join(__dirname, '..', file.fileUrl);
    fs.unlink(absolute, (err) => {
      if (err) console.error('Error deleting file', err);
    });
    await prisma.catalogFile.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));