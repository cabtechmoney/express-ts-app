/**
 * Seed script for Caleb CRM.
 *
 * IMPORTANT: Before running this, the tables must already exist in Supabase.
 * Apply `supabase-schema.sql` in the Supabase SQL Editor first.
 *
 * This script inserts sample clients and projects so the
 * dashboard / clients / projects pages have data to display.
 *
 * Usage:
 *   node seed.js
 */

require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const clients = [
  { name: "Acme Retail", email: "hello@acme.com", phone: "+15551234567", company: "Acme Retail Ltd" },
  { name: "Northstar Labs", email: "team@northstar.io", phone: "+15559876543", company: "Northstar Labs" },
  { name: "Lagos Studio", email: "info@lagosstudio.ng", phone: "+2348012345678", company: "Lagos Studio" },
  { name: "Globex Corp", email: "billing@globex.com", phone: "+15555550199", company: "Globex Corporation" },
];

const projectsByClient = {
  "hello@acme.com": [
    { title: "eCommerce Replatform", description: "Migrate to modern commerce stack", status: "In Progress", budget: 18400, deadline: "2026-12-15" },
    { title: "Brand Refresh", description: "Update visual identity system", status: "Todo", budget: 6200, deadline: "2026-11-01" },
  ],
  "team@northstar.io": [
    { title: "Mobile App Launch", description: "iOS + Android MVP", status: "Review", budget: 9800, deadline: "2026-10-30" },
  ],
  "info@lagosstudio.ng": [
    { title: "Website Redesign", description: "Marketing site overhaul", status: "In Progress", budget: 6250, deadline: "2026-12-01" },
  ],
  "billing@globex.com": [
    { title: "CRM Integration", description: "Connect CRM with billing", status: "Todo", budget: 12000, deadline: "2027-01-15" },
  ],
};

async function seed() {
  console.log("Starting seed...");
  const createdClientIds = {};

  for (const client of clients) {
    const { data: existing, error: checkErr } = await supabase
      .from("clients")
      .select("id")
      .eq("email", client.email)
      .maybeSingle();

    if (checkErr) {
      console.error("Error checking client:", checkErr.message);
      continue;
    }

    let clientId = existing?.id;
    if (!clientId) {
      const { data, error } = await supabase
        .from("clients")
        .insert(client)
        .select("id")
        .single();
      if (error) {
        console.error("Error creating client:", error.message);
        continue;
      }
      clientId = data.id;
      console.log(`Created client: ${client.name}`);
    } else {
      console.log(`Client exists: ${client.name}`);
    }
    createdClientIds[client.email] = clientId;
  }

  for (const client of clients) {
    const clientId = createdClientIds[client.email];
    if (!clientId) continue;

    const projects = projectsByClient[client.email] || [];
    for (const project of projects) {
      const { data, error } = await supabase
        .from("projects")
        .insert({ ...project, clientId })
        .select("id")
        .single();
      if (error) {
        console.error(`Error creating project "${project.title}":`, error.message);
      } else {
        console.log(`Created project: ${project.title}`);
      }
    }
  }

  console.log("Seed complete.");
}

seed();
