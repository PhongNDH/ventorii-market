'use server';

import { revalidateTag } from 'next/cache';

export const revalidateProduct = async () => {
  revalidateTag('product');
};
export const fetchProduct = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/product/all`,
      {
        method: 'GET',
        next: {
          tags: ['product'],
          revalidate: false,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log('Error to fetch data', err);
    return null;
  }
};
