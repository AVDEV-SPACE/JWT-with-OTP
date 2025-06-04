"use server"
import { NextApiRequest, NextApiResponse } from 'next';
import { revalidatePath } from 'next/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Revalidate the /admin page
    await revalidatePath('/admin');
    res.status(200).json({ revalidated: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revalidate' });
  }
}
