import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://blmepnymhrbzolmpnixy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsbWVwbnltaHJiem9sbXBuaXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzQ0MjUsImV4cCI6MjA5NTQ1MDQyNX0.OHEHi_3Derh7nL2ST7mUxntS2G6RzCZCzHM35ct9YV4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
