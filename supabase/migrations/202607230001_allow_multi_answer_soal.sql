alter table public.soal
drop constraint if exists soal_jawaban_benar_check;

alter table public.soal
add constraint soal_jawaban_benar_check
check (jawaban_benar ~ '^[a-e](,[a-e])*$');
