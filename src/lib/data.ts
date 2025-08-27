import { supabase } from './supabase';
import type { Preorder, DoorSale } from '@/types';
import { todayDate, nowISO } from './dates';

/** PREVENTAS */
export async function fetchPreorders(): Promise<Preorder[]> {
  const { data, error } = await supabase
    .from('Preorders')
    .select('id, fullName, quantity, finalPrice, paymentMethod, date, checkedInCount, createdAt, updatedAt, UserId')
    .order('fullName', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Preorder[];
}

export async function setPreorderChecked(id: number, newCount: number): Promise<Preorder> {
  const { data, error } = await supabase
    .from('Preorders')
    .update({ checkedInCount: newCount, updatedAt: nowISO() })
    .eq('id', id)
    .select('id, fullName, quantity, finalPrice, paymentMethod, date, checkedInCount, createdAt, updatedAt, UserId')
    .single();
  if (error) throw error;
  return data as Preorder;
}

/** ATTENDANCES: insertar delta de ingresos */
export async function insertAttendance(deltaCount: number) {
  const payload = {
    count: deltaCount,
    timestamp: nowISO(),
    createdAt: nowISO(),
    updatedAt: nowISO(),
    UserId: null as number | null
  };
  const { error } = await supabase.from('Attendances').insert(payload);
  if (error) throw error;
}

/** VENTAS EN PUERTA */
export async function fetchDoorSales(): Promise<DoorSale[]> {
  const { data, error } = await supabase
    .from('DoorSales')
    .select('id, fullName, quantity, finalPrice, paymentMethod, date, createdAt, updatedAt, UserId')
    .order('date', { ascending: false })
    .order('id', { ascending: false });
  if (error) throw error;
  return (data ?? []) as DoorSale[];
}

export async function createDoorSale(entry: { fullName: string; quantity: number; finalPrice: number; paymentMethod: string; }): Promise<DoorSale> {
  const base = {
    fullName: entry.fullName,                    // NOT NULL
    quantity: entry.quantity,                    // NOT NULL
    finalPrice: entry.finalPrice,                // NOT NULL
    paymentMethod: entry.paymentMethod,          // NOT NULL
    date: todayDate(),                           // DATE (no hora)
    createdAt: nowISO(),
    updatedAt: nowISO(),
    UserId: null as number | null
  };
  const { data, error } = await supabase
    .from('DoorSales')
    .insert(base)
    .select('id, fullName, quantity, finalPrice, paymentMethod, date, createdAt, updatedAt, UserId')
    .single();
  if (error) throw error;

  // reflejar asistencia en el mismo movimiento
  await insertAttendance(entry.quantity);

  return data as DoorSale;
}
