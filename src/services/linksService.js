import { supabase } from "../lib/supabaseClient";

const TABLE = "links";

const stripMeta = (fields) => {
  const payload = { ...fields };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.materi;
  return payload;
};

export const linksService = {
  list: async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*, materi(id, kode_bahan_ajar, topik)");
    if (error) throw error;
    return data;
  },

  listByMateriId: async (materiId) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("materi_id", materiId);
    if (error) throw error;
    return data;
  },

  get: async (id) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  create: async (fields) => {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(stripMeta(fields))
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, fields) => {
    const { data, error } = await supabase
      .from(TABLE)
      .update(stripMeta(fields))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  remove: async (id) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
