"use server"

import { redirect } from 'next/navigation';
import { SocioFormData } from './schema';

export async function guardarSocio(data: SocioFormData) {
  await fetch('https://tu-api-dotnet.com/api/socios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  redirect('/dashboard/socios');
}
