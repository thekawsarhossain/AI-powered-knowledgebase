'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { CreateArticleRequest, UpdateArticleRequest } from '@/types';

export async function createArticleAction(data: CreateArticleRequest) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create article');
    }

    const result = await response.json();

    revalidatePath('/dashboard');
    revalidateTag('articles');

    return { success: true, data: result.data };
  } catch (error: unknown) {
    return { success: false, error: (error as { message: string })?.message };
  }
}

export async function updateArticleAction(
  id: string,
  data: UpdateArticleRequest
) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update article');
    }

    const result = await response.json();

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/articles/${id}`);
    revalidateTag('articles');

    return { success: true, data: result.data };
  } catch (error: unknown) {
    return { success: false, error: (error as { message: string }).message };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete article');
    }

    revalidatePath('/dashboard');
    revalidateTag('articles');

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as { message: string }).message };
  }
}

export async function summarizeArticleAction(id: string) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ai/summarize/${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to summarize article');
    }

    const result = await response.json();

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/articles/${id}`);
    revalidateTag('articles');

    return { success: true, summary: result.data.summary };
  } catch (error: unknown) {
    return { success: false, error: (error as { message: string }).message };
  }
}
