import { useState, useEffect } from "react";

const TEAM = ["Carla","Raissa","Georgia","Dom","Andrew","Margs","Emma","Minh"];

const STOCK_ITEMS = [
  { key:"banner_promo", label:"Pull-up Banner (Promo)", unit:"banner", default:1 },
  { key:"banner_brand", label:"Pull-up Banner (Brand)", unit:"banner", default:1 },
  { key:"brochures",    label:"A5 Brochures",           unit:"pcs",    default:50 },
  { key:"brochure_holder", label:"A5 Brochure Holder",  unit:"holder", default:1 },
  { key:"pen_holder",  label:"Pen Holder",              unit:"holder", default:1 },
  { key:"pen_case",    label:"Pen Case",                unit:"case",   default:1 },
  { key:"pens",        label:"Pens",                   unit:"pens",   default:100 },
  { key:"tablecloth",  label:"Tablecloth",              unit:"cloth",  default:1 },
  { key:"mentos",      label:"Mentos",                  unit:"packs",  default:10 },
  { key:"mentos_holder", label:"Mentos Holder",         unit:"holder", default:1 },
];

const DK = Object.fromEntries(STOCK_ITEMS.map(i=>[i.key,i.default]));
const ZK = Object.fromEntries(STOCK_ITEMS.map(i=>[i.key,0]));

// LHD colour palette - each district gets a distinct colour
const LHD_COLOURS = {
  "Westmead":    { bg:"#EEF2FF", border:"#6366f1", text:"#3730a3", dot:"#6366f1" },
  "RPA":         { bg:"#FFF1F2", border:"#f43f5e", text:"#9f1239", dot:"#f43f5e" },
  "POW":         { bg:"#F0FDF4", border:"#22c55e", text:"#14532d", dot:"#22c55e" },
  "CBH":         { bg:"#FFF7ED", border:"#f97316", text:"#7c2d12", dot:"#f97316" },
  "Nepean":      { bg:"#ECFEFF", border:"#06b6d4", text:"#164e63", dot:"#06b6d4" },
  "St George":   { bg:"#FDF4FF", border:"#a855f7", text:"#581c87", dot:"#a855f7" },
  "Blacktown":   { bg:"#FFF9C4", border:"#eab308", text:"#713f12", dot:"#eab308" },
  "Auburn":      { bg:"#F0F9FF", border:"#38bdf8", text:"#0c4a6e", dot:"#38bdf8" },
  "Cumberland":  { bg:"#FFF0F0", border:"#ef4444", text:"#7f1d1d", dot:"#ef4444" },
  "Mt Druitt":   { bg:"#F7FEE7", border:"#84cc16", text:"#365314", dot:"#84cc16" },
  "TSH":         { bg:"#FDF2F8", border:"#ec4899", text:"#831843", dot:"#ec4899" },
  "SSEH":        { bg:"#F0FDFA", border:"#14b8a6", text:"#134e4a", dot:"#14b8a6" },
  "RNS":         { bg:"#FFFBEB", border:"#f59e0b", text:"#78350f", dot:"#f59e0b" },
  "Sutherland":  { bg:"#EFF6FF", border:"#3b82f6", text:"#1e3a8a", dot:"#3b82f6" },
  "Concord":     { bg:"#F5F3FF", border:"#8b5cf6", text:"#4c1d95", dot:"#8b5cf6" },
  "Canterbury":  { bg:"#FEFCE8", border:"#ca8a04", text:"#713f12", dot:"#ca8a04" },
  "Camden":      { bg:"#F0FDF4", border:"#4ade80", text:"#14532d", dot:"#4ade80" },
  "default":     { bg:"#F8F8F8", border:"#94a3b8", text:"#334155", dot:"#94a3b8" },
};

function lhd(suburb) { return LHD_COLOURS[suburb] || LHD_COLOURS.default; }

const STATUS_CFG = {
  Confirmed:  { bg:"#e1f5ee", color:"#085041", dot:"#1D9E75" },
  Tentative:  { bg:"#FAEEDA", color:"#633806", dot:"#BA7517" },
  Completed:  { bg:"#EEEDFE", color:"#3C3489", dot:"#7F77DD" },
  Cancelled:  { bg:"#FCEBEB", color:"#A32D2D", dot:"#E24B4A" },
};

const ALL_TYPES = ["Stall","Vaccination","Corp Orientation","Nurse Orientation","Morning Tea","Afternoon Tea","BBQ","Hamper Delivery","NM Event","Ward Walk","Special Event","Staff Benefits","Graduation","Research Forum"];
const STATES = ["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
const HOSPITALS = ["RPA","Westmead","POW","CBH","Nepean","St George","Blacktown","Auburn","Cumberland","Mt Druitt","TSH","SSEH","RNS","Sutherland","Concord","Canterbury","Camden","Other"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── MARKETING TASK TEMPLATES ──────────────────────────────────────────────────
// Each type produces Pre / Day-of / Post tasks
// type: email | social | photo | order | admin | content
const MKT_TEMPLATES = {
  default: [
    {phase:"Pre",  type:"email",   label:"Send confirmation email to hospital contact"},
    {phase:"Pre",  type:"social",  label:"Schedule Instagram post (event announcement)"},
    {phase:"Pre",  type:"order",   label:"Confirm stock packed & allocated to team"},
    {phase:"Pre",  type:"admin",   label:"Add event to HHL LinkedIn calendar"},
    {phase:"Day",  type:"photo",   label:"Take setup photo before attendees arrive"},
    {phase:"Day",  type:"photo",   label:"Capture candid shots / team at stall"},
    {phase:"Day",  type:"photo",   label:"Record short video / reel clip on the day"},
    {phase:"Post", type:"email",   label:"Send thank-you email to hospital contact"},
    {phase:"Post", type:"content", label:"Write event recap (3–5 sentences for caption)"},
    {phase:"Post", type:"social",  label:"Post event photo to Instagram"},
    {phase:"Post", type:"admin",   label:"Log leads captured into CRM"},
  ],
  Vaccination: [
    {phase:"Pre",  type:"email",   label:"Confirm vaccination session details with hospital"},
    {phase:"Pre",  type:"social",  label:"Schedule LinkedIn post (flu season / vax reminder)"},
    {phase:"Pre",  type:"order",   label:"Confirm stock & consent forms printed"},
    {phase:"Day",  type:"photo",   label:"Photo of vax station setup"},
    {phase:"Day",  type:"photo",   label:"Candid shots of staff & attendees"},
    {phase:"Day",  type:"admin",   label:"Record attendee count on the day"},
    {phase:"Post", type:"email",   label:"Send post-vax summary to hospital contact"},
    {phase:"Post", type:"content", label:"Write wrap-up post (numbers, highlights)"},
    {phase:"Post", type:"social",  label:"Post to Instagram & LinkedIn"},
    {phase:"Post", type:"admin",   label:"Log attendance figures"},
  ],
  "Special Event": [
    {phase:"Pre",  type:"email",   label:"Confirm logistics & agenda with hospital"},
    {phase:"Pre",  type:"social",  label:"Pre-event hype post (Instagram Stories)"},
    {phase:"Pre",  type:"order",   label:"Order any special items / catering"},
    {phase:"Pre",  type:"content", label:"Brief team on talking points & messaging"},
    {phase:"Day",  type:"photo",   label:"Setup & venue shots before guests arrive"},
    {phase:"Day",  type:"photo",   label:"Candid event photography"},
    {phase:"Day",  type:"photo",   label:"Team photo at event"},
    {phase:"Day",  type:"social",  label:"Post to Instagram Stories live from event"},
    {phase:"Post", type:"email",   label:"Thank-you email to organiser"},
    {phase:"Post", type:"content", label:"Write detailed event recap for newsletter"},
    {phase:"Post", type:"social",  label:"Post highlight reel to Instagram & LinkedIn"},
    {phase:"Post", type:"admin",   label:"Log leads & contacts from event"},
  ],
  BBQ: [
    {phase:"Pre",  type:"email",   label:"Confirm BBQ logistics with hospital"},
    {phase:"Pre",  type:"order",   label:"Order food supplies & confirm quantities"},
    {phase:"Pre",  type:"social",  label:"Pre-event post (team BBQ / community vibe)"},
    {phase:"Day",  type:"photo",   label:"BBQ setup photo"},
    {phase:"Day",  type:"photo",   label:"Action shots — cooking, team, attendees"},
    {phase:"Day",  type:"social",  label:"Post to Instagram Stories"},
    {phase:"Post", type:"email",   label:"Thank-you email to hospital contact"},
    {phase:"Post", type:"content", label:"Caption + recap for grid post"},
    {phase:"Post", type:"social",  label:"Post to Instagram"},
    {phase:"Post", type:"admin",   label:"Log leads & connections made"},
  ],
  "Morning Tea": [
    {phase:"Pre",  type:"order",   label:"Order pastries / catering"},
    {phase:"Pre",  type:"email",   label:"Confirm morning tea logistics"},
    {phase:"Pre",  type:"social",  label:"Schedule pre-event post"},
    {phase:"Day",  type:"photo",   label:"Table setup & food spread photo"},
    {phase:"Day",  type:"photo",   label:"Candid photos with attendees"},
    {phase:"Post", type:"email",   label:"Thank-you email"},
    {phase:"Post", type:"social",  label:"Post highlights to Instagram"},
    {phase:"Post", type:"admin",   label:"Log contacts made"},
  ],
  "Afternoon Tea": [
    {phase:"Pre",  type:"order",   label:"Order afternoon tea catering"},
    {phase:"Pre",  type:"email",   label:"Confirm details with hospital"},
    {phase:"Day",  type:"photo",   label:"Setup & spread photos"},
    {phase:"Day",  type:"photo",   label:"Candid shots"},
    {phase:"Post", type:"email",   label:"Thank-you email"},
    {phase:"Post", type:"social",  label:"Post to Instagram"},
    {phase:"Post", type:"admin",   label:"Log contacts"},
  ],
  "NM Event": [
    {phase:"Pre",  type:"email",   label:"Confirm NM event brief & guest list"},
    {phase:"Pre",  type:"social",  label:"Pre-event Stories teaser"},
    {phase:"Pre",  type:"order",   label:"Confirm catering / coffee cart booking"},
    {phase:"Pre",  type:"content", label:"Prepare talking points for NM audience"},
    {phase:"Day",  type:"photo",   label:"Venue & setup shots"},
    {phase:"Day",  type:"photo",   label:"Speaker / team photos"},
    {phase:"Day",  type:"social",  label:"Live Stories from event"},
    {phase:"Post", type:"email",   label:"Thank-you to NM lead / organiser"},
    {phase:"Post", type:"content", label:"Event recap for newsletter / LinkedIn"},
    {phase:"Post", type:"social",  label:"Grid post with highlights"},
    {phase:"Post", type:"admin",   label:"Log attendee contacts & follow-ups"},
  ],
  "Hamper Delivery": [
    {phase:"Pre",  type:"order",   label:"Confirm hamper contents & quantities"},
    {phase:"Pre",  type:"email",   label:"Notify hospital contact of delivery"},
    {phase:"Day",  type:"photo",   label:"Photo of hampers before delivery"},
    {phase:"Day",  type:"photo",   label:"Delivery / handover shot"},
    {phase:"Post", type:"social",  label:"Post hamper delivery to Instagram Stories"},
    {phase:"Post", type:"email",   label:"Follow-up confirmation email"},
    {phase:"Post", type:"admin",   label:"Log delivery in CRM"},
  ],
  Graduation: [
    {phase:"Pre",  type:"email",   label:"Confirm graduation event logistics"},
    {phase:"Pre",  type:"order",   label:"Prepare gift / voucher for presentation"},
    {phase:"Pre",  type:"social",  label:"Pre-event congratulations post"},
    {phase:"Day",  type:"photo",   label:"HHL stall / table setup photo"},
    {phase:"Day",  type:"photo",   label:"Photo with graduates"},
    {phase:"Post", type:"social",  label:"Congratulations post to Instagram & LinkedIn"},
    {phase:"Post", type:"email",   label:"Thank-you & follow-up email"},
    {phase:"Post", type:"admin",   label:"Log graduate contacts for pipeline"},
  ],
};

function getMktTemplate(eventType){
  return (MKT_TEMPLATES[eventType]||MKT_TEMPLATES.default).map((t,i)=>({
    ...t, id: `${Date.now()}-${i}`, done:false, assignee:"Minh", customNote:"",
  }));
}

const TASK_TYPE_CFG = {
  email:   {icon:"✉️", bg:"#EFF6FF", color:"#1e40af"},
  social:  {icon:"📱", bg:"#FDF4FF", color:"#7e22ce"},
  photo:   {icon:"📷", bg:"#F0FDF4", color:"#15803d"},
  order:   {icon:"📦", bg:"#FFF7ED", color:"#c2410c"},
  content: {icon:"✍️", bg:"#FEFCE8", color:"#a16207"},
  admin:   {icon:"🗂️", bg:"#F5F3FF", color:"#6d28d9"},
};

const PHASE_ORDER = ["Pre","Day","Post"];
const PHASE_LABELS = {Pre:"Pre-event",Day:"Day of",Post:"Post-event"};

// ── ZAPIER WEBHOOK ────────────────────────────────────────────────────────────
async function fireZapier(webhookUrl, eventObj) {
  if (!webhookUrl || !webhookUrl.startsWith("https://hooks.zapier.com")) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "HHL Events",
        timestamp: new Date().toISOString(),
        event_id: eventObj.id,
        event_name: eventObj.name,
        event_type: eventObj.eventType,
        status: eventObj.status,
        date: eventObj.date,
        time: eventObj.time,
        end_time: eventObj.endTime,
        hospital: eventObj.suburb,
        address: eventObj.address,
        lead: eventObj.lead,
        team: eventObj.team.join(", "),
        expected_attendees: eventObj.expectedAttendees,
        budget: eventObj.budget,
        site_contact_name: eventObj.siteContactName,
        site_contact_phone: eventObj.siteContactPhone,
        site_contact_email: eventObj.siteContactEmail,
        notes: eventObj.notes,
      }),
    });
  } catch (e) {
    console.warn("Zapier webhook failed:", e);
  }
}

function parseDate(d) {
  if (!d) return "";
  const m = d.match(/([A-Za-z]+)\s+(\d+),\s+(\d+)/);
  if (!m) return "";
  const months = {January:"01",February:"02",March:"03",April:"04",May:"05",June:"06",July:"07",August:"08",September:"09",October:"10",November:"11",December:"12"};
  return `${m[3]}-${months[m[1]]}-${String(m[2]).padStart(2,"0")}`;
}

function parseTime(t) {
  if (!t) return { time:"", endTime:"" };
  const clean = t.trim();
  const range = clean.match(/(\d+(?::\d+)?(?:am|pm)?)\s*[-–to]+\s*(\d+(?::\d+)?(?:am|pm)?)/i);
  function to24(s) {
    s = s.trim().toLowerCase();
    const isPm = s.includes("pm"), isAm = s.includes("am");
    s = s.replace(/am|pm/gi,"").trim();
    let [h,mm] = s.includes(":") ? s.split(":").map(Number) : [Number(s),0];
    if (isPm && h!==12) h+=12;
    if (isAm && h===12) h=0;
    return `${String(h).padStart(2,"0")}:${String(mm||0).padStart(2,"0")}`;
  }
  if (range) return { time:to24(range[1]), endTime:to24(range[2]) };
  const single = clean.match(/(\d+(?::\d+)?(?:am|pm)?)/i);
  if (single) return { time:to24(single[1]), endTime:"" };
  return { time:"", endTime:"" };
}

function parseStaff(s) {
  if (!s) return [];
  return s.split(",").map(x=>x.trim()).filter(Boolean).map(n=>{
    if(n.includes("Carla")) return "Carla";
    if(n.includes("Domenic")||n.includes("Dom")) return "Dom";
    if(n.includes("Georgia")) return "Georgia";
    if(n.includes("Raissa")||n.includes("Tazkia")) return "Raissa";
    if(n.includes("Minh")) return "Minh";
    if(n.includes("Marguerite")||n.includes("Margs")) return "Margs";
    if(n.includes("Emma")) return "Emma";
    if(n.includes("Andrew")) return "Andrew";
    return null;
  }).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);
}

function inferStatus(dateStr) {
  if (!dateStr) return "Tentative";
  const today = new Date().toISOString().split("T")[0];
  return dateStr < today ? "Completed" : "Confirmed";
}

function getWeekDates(offsetWeeks=0) {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (day===0?6:day-1) + offsetWeeks*7);
  return Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d.toISOString().split("T")[0]; });
}

const RAW = [
  {name:"Westmead — Nurse Orientation",attendees:"",bring:"",budget:"",date:"April 13, 2026",hospital:"Westmead",location:"",notes:"",staff:"Carla Nesci",time:"",type:"Nurse Orientation"},
  {name:"Nepean — Afternoon Tea & Presso",attendees:"25",bring:"",budget:"",date:"May 1, 2026",hospital:"Nepean",location:"Nepean Hospital, ICET",notes:"",staff:"Georgia Wood",time:"3.30-4.30pm",type:"Afternoon Tea"},
  {name:"Westmead — Vaccination",attendees:"400",bring:"",budget:"",date:"April 29, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"Georgia Wood, Emma",time:"7am to 4pm",type:"Vaccination"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"April 7, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Westmead — Vaccination",attendees:"900",bring:"",budget:"",date:"April 8, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"",time:"7am to 4pm",type:"Vaccination"},
  {name:"Mt Druitt — Vaccination",attendees:"350",bring:"",budget:"",date:"May 1, 2026",hospital:"Mt Druitt",location:"Staff Cafeteria, near front entrance",notes:"",staff:"Georgia Wood",time:"9am to 4pm",type:"Vaccination"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"April 15, 2026",hospital:"RPA",location:"",notes:"",staff:"Georgia Wood",time:"",type:"Stall"},
  {name:"STG / Lithgow — Stall",attendees:"",bring:"",budget:"",date:"April 1, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"April 1, 2026",hospital:"RPA",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"April 22, 2026",hospital:"RPA",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Stall"},
  {name:"Westmead — Vaccination",attendees:"550",bring:"",budget:"",date:"April 28, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"Georgia Wood, Domenic Nesci",time:"7am to 4pm",type:"Vaccination"},
  {name:"St George — Corp Orientation",attendees:"",bring:"",budget:"",date:"April 13, 2026",hospital:"St George",location:"",notes:"",staff:"Domenic Nesci",time:"8:30AM - 12:00PM",type:"Corp Orientation"},
  {name:"Westmead — Vaccination",attendees:"700",bring:"",budget:"",date:"April 16, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"Domenic Nesci, Georgia Wood",time:"7am to 4pm",type:"Vaccination"},
  {name:"Westmead — Vaccination",attendees:"800",bring:"",budget:"",date:"April 9, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"Emma, Domenic Nesci, Georgia Wood",time:"7am to 4pm",type:"Vaccination"},
  {name:"Blacktown — Vaccination",attendees:"450",bring:"",budget:"",date:"April 14, 2026",hospital:"Blacktown",location:"Blacktown Clinical School Level 3, via front entrance",notes:"",staff:"Georgia Wood, Carla Nesci",time:"7am to 4pm",type:"Vaccination"},
  {name:"Nepean — Stall",attendees:"",bring:"",budget:"",date:"April 23, 2026",hospital:"Nepean",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Stall"},
  {name:"Cumberland — Vaccination",attendees:"220",bring:"",budget:"",date:"April 23, 2026",hospital:"Cumberland",location:"Riverview 'The Clinic', Cumberland campus",notes:"",staff:"Georgia Wood",time:"1:00pm to 2:30pm",type:"Vaccination"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"April 21, 2026",hospital:"CBH",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Stall"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"April 29, 2026",hospital:"RPA",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Stall"},
  {name:"Auburn — Vaccination",attendees:"200",bring:"",budget:"",date:"April 22, 2026",hospital:"Auburn",location:"Level 5, Corporate Education Suite",notes:"",staff:"Georgia Wood",time:"8:30am to 4pm",type:"Vaccination"},
  {name:"Blacktown — Vaccination",attendees:"650",bring:"",budget:"",date:"April 13, 2026",hospital:"Blacktown",location:"Blacktown Clinical School Level 3, via front entrance",notes:"",staff:"Georgia Wood, Emma",time:"7am to 4pm",type:"Vaccination"},
  {name:"Westmead — Vaccination",attendees:"600",bring:"",budget:"",date:"April 17, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"Georgia Wood, Domenic Nesci",time:"7am to 4pm",type:"Vaccination"},
  {name:"TSH — Corp Orientation",attendees:"",bring:"",budget:"",date:"April 20, 2026",hospital:"TSH",location:"",notes:"",staff:"Georgia Wood",time:"8:30 - 11",type:"Corp Orientation"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"April 8, 2026",hospital:"RPA",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"April 8, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"May 5, 2026",hospital:"CBH",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Stall"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"May 13, 2026",hospital:"RPA",location:"",notes:"",staff:"Georgia Wood, Emma",time:"8:30 - 4:00",type:"Stall"},
  {name:"St George — Allied Health KSB Welcome Party",attendees:"",bring:"",budget:"A$800.00",date:"May 13, 2026",hospital:"St George",location:"Balcony of Kensington Street Building",notes:"Budget: $800",staff:"Minh Le, Domenic Nesci",time:"12:30pm - 2:30pm",type:"Special Event"},
  {name:"St George — Nurses & Midwives Day",attendees:"",bring:"",budget:"",date:"May 12, 2026",hospital:"St George",location:"Lvl 1 atrium",notes:"",staff:"Minh Le, Domenic Nesci, Tazkia Raissa",time:"9-12pm",type:"Hamper Delivery"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"May 27, 2026",hospital:"RPA",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:"May 20, 2026",hospital:"RPA",location:"",notes:"",staff:"",time:"8:30am - 4pm",type:"Stall"},
  {name:"Auburn — Vaccination",attendees:"200",bring:"",budget:"",date:"May 7, 2026",hospital:"Auburn",location:"Level 5, Corporate Education Suite",notes:"",staff:"Georgia Wood",time:"8:30am to 4pm",type:"Vaccination"},
  {name:"Westmead — Nurse Orientation",attendees:"",bring:"",budget:"",date:"May 4, 2026",hospital:"Westmead",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Nurse Orientation"},
  {name:"TSH — Corp Orientation",attendees:"",bring:"",budget:"",date:"May 11, 2026",hospital:"TSH",location:"",notes:"",staff:"Georgia Wood",time:"8:30 - 11:00",type:"Corp Orientation"},
  {name:"SSEH — Stall",attendees:"",bring:"",budget:"",date:"May 21, 2026",hospital:"SSEH",location:"",notes:"",staff:"",time:"8:30am - 4pm",type:"Stall"},
  {name:"Westmead — Ward Walk",attendees:"",bring:"",budget:"",date:"May 11, 2026",hospital:"Westmead",location:"",notes:"",staff:"Domenic Nesci, Carla Nesci, Minh Le",time:"9:00 am",type:"Ward Walk"},
  {name:"Blacktown — Vaccination",attendees:"350",bring:"",budget:"",date:"May 27, 2026",hospital:"Blacktown",location:"Blacktown Clinical School Level 3, via front entrance",notes:"",staff:"",time:"7am to 4pm",type:"Vaccination"},
  {name:"Nepean — Stall",attendees:"",bring:"",budget:"",date:"May 28, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Sutherland — NM Event",attendees:"",bring:"",budget:"",date:"May 6, 2026",hospital:"Sutherland",location:"",notes:"",staff:"Carla Nesci, Marguerite White, Georgia Wood",time:"6:30pm",type:"NM Event"},
  {name:"Westmead — Vaccination",attendees:"400",bring:"",budget:"",date:"May 29, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"",time:"7am to 4pm",type:"Vaccination"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"May 4, 2026",hospital:"POW",location:"",notes:"",staff:"Emma, Georgia Wood",time:"",type:"Stall"},
  {name:"POW — Corp Orientation",attendees:"",bring:"",budget:"",date:"May 25, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"Mt Druitt — Vaccination",attendees:"",bring:"",budget:"",date:"May 19, 2026",hospital:"Mt Druitt",location:"Staff Cafeteria, near front entrance",notes:"",staff:"",time:"9am to 4pm",type:"Vaccination"},
  {name:"St George — Nurses & Midwives Ball",attendees:"",bring:"",budget:"A$2,000.00",date:"May 8, 2026",hospital:"St George",location:"Flinders Pavillion",notes:"Budget: $2,000",staff:"",time:"6pm - 8pm",type:"Staff Benefits"},
  {name:"St George — Corp Orientation",attendees:"",bring:"",budget:"",date:"May 18, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"8:30AM - 12:00PM",type:"Corp Orientation"},
  {name:"Westmead — Vaccination",attendees:"300",bring:"",budget:"",date:"May 11, 2026",hospital:"Westmead",location:"WECC level 1 L103 & L104",notes:"",staff:"Carla Nesci, Minh Le",time:"7am to 4pm",type:"Vaccination"},
  {name:"Cumberland — Vaccination",attendees:"",bring:"",budget:"",date:"May 5, 2026",hospital:"Cumberland",location:"",notes:"",staff:"Carla Nesci",time:"",type:"Vaccination"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"May 19, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"8:30am - 4pm",type:"Stall"},
  {name:"St George — Research & Innovation Forum",attendees:"",bring:"",budget:"",date:"May 26, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Special Event"},
  ...Array.from({length:31},(_,i)=>{
    const dates=["June 3","June 10","June 17","June 24","July 1","July 8","July 15","July 22","July 29","August 5","August 12","August 19","August 26","September 2","September 9","September 16","September 23","September 30","October 7","October 14","October 21","October 28","November 4","November 11","November 18","November 25","December 2","December 9","December 16","December 23","December 30"];
    return {name:"RPA — Stall",attendees:"",bring:"",budget:"",date:`${dates[i]}, 2026`,hospital:"RPA",location:"",notes:"",staff:"",time:"",type:"Stall"};
  }),
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"June 2, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"June 16, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"July 7, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"July 21, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"August 4, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"August 18, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"September 1, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"CBH — Stall",attendees:"",bring:"",budget:"",date:"September 8, 2026",hospital:"CBH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Nepean — Stall",attendees:"",bring:"",budget:"",date:"June 25, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Nepean — Stall",attendees:"",bring:"",budget:"",date:"July 23, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Nepean — Stall",attendees:"",bring:"",budget:"",date:"August 27, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Nepean — Stall",attendees:"",bring:"",budget:"",date:"September 24, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Nepean — Staff Benefits",attendees:"",bring:"",budget:"",date:"June 10, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Staff Benefits"},
  {name:"Nepean — Staff Benefits",attendees:"",bring:"",budget:"",date:"September 9, 2026",hospital:"Nepean",location:"",notes:"",staff:"",time:"",type:"Staff Benefits"},
  {name:"TSH — Corp Orientation",attendees:"",bring:"",budget:"",date:"June 29, 2026",hospital:"TSH",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"TSH — Corp Orientation",attendees:"",bring:"",budget:"",date:"August 10, 2026",hospital:"TSH",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"TSH — Nurse Graduation",attendees:"",bring:"$200 gift card",budget:"A$200.00",date:"August 25, 2026",hospital:"TSH",location:"",notes:"Bring $200 gift card",staff:"",time:"",type:"Graduation"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"June 5, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"July 6, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"July 27, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"August 3, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"September 7, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Stall",attendees:"",bring:"",budget:"",date:"September 28, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"POW — Corp Orientation",attendees:"",bring:"",budget:"",date:"June 22, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"POW — Corp Orientation",attendees:"",bring:"",budget:"",date:"August 24, 2026",hospital:"POW",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"STG — Stall",attendees:"",bring:"",budget:"",date:"June 3, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"STG — Stall",attendees:"",bring:"",budget:"",date:"July 1, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"STG — Stall",attendees:"",bring:"",budget:"",date:"August 5, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"STG — Stall",attendees:"",bring:"",budget:"",date:"September 2, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"STG — Corp Orientation",attendees:"",bring:"",budget:"",date:"June 15, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"STG — Corp Orientation",attendees:"",bring:"",budget:"",date:"July 20, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"STG — Corp Orientation",attendees:"",bring:"",budget:"",date:"August 17, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"STG — Corp Orientation",attendees:"",bring:"",budget:"",date:"September 14, 2026",hospital:"St George",location:"",notes:"",staff:"",time:"",type:"Corp Orientation"},
  {name:"SSEH — Stall",attendees:"",bring:"",budget:"",date:"June 5, 2026",hospital:"SSEH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"SSEH — Stall",attendees:"",bring:"",budget:"",date:"August 13, 2026",hospital:"SSEH",location:"",notes:"",staff:"",time:"",type:"Stall"},
  {name:"Westmead — Vaccination",attendees:"",bring:"",budget:"",date:"June 4, 2026",hospital:"Westmead",location:"",notes:"",staff:"",time:"",type:"Vaccination"},
  {name:"Nepean - NM Event",attendees:"150",bring:"Coffee Cart",budget:"A$1,500.00",date:"May 6, 2026",hospital:"Nepean",location:"",notes:"Budget: $1,500. Bring coffee cart.",staff:"Domenic Nesci, Emma",time:"12pm",type:"NM Event"},
  {name:"Unity Games - Cumberland",attendees:"",bring:"",budget:"",date:"April 23, 2026",hospital:"Cumberland",location:"",notes:"",staff:"",time:"4:00pm - 8:30pm",type:"Special Event"},
  {name:"Westmead - Packing Hampers",attendees:"",bring:"",budget:"A$1,244.02",date:"April 24, 2026",hospital:"Westmead",location:"",notes:"Budget: $1,244.02",staff:"",time:"9:00 - 12:00",type:"Hamper Delivery"},
  {name:"RHW - International Day of The Midwife",attendees:"300",bring:"Pastries",budget:"A$250.00",date:"May 7, 2026",hospital:"POW",location:"Royal Hospital For Women",notes:"Contact: Leanne Horvat 0404 034 148. Budget: $250.",staff:"Domenic Nesci, Emma",time:"1.30-4.30pm",type:"Morning Tea"},
  {name:"Canterbury Hospital — Stall",attendees:"",bring:"",budget:"",date:"May 5, 2026",hospital:"Canterbury",location:"Foyer",notes:"",staff:"Georgia Wood, Emma",time:"10am-3pm",type:"Stall"},
  {name:"RPA - Staff BBQ",attendees:"",bring:"",budget:"",date:"May 8, 2026",hospital:"RPA",location:"RL Harris Room",notes:"",staff:"Carla Nesci, Emma, Georgia Wood",time:"10-3pm",type:"BBQ"},
  {name:"Concord - BBQ and Awards",attendees:"",bring:"",budget:"",date:"May 12, 2026",hospital:"Concord",location:"Concord on the Green",notes:"",staff:"Emma, Georgia Wood, Carla Nesci",time:"10-3.30pm",type:"BBQ"},
  {name:"Westmead - Nursing & Midwifery Awards",attendees:"",bring:"",budget:"",date:"May 15, 2026",hospital:"Westmead",location:"Level 4 Block K Westmead Innovation Centre",notes:"",staff:"Domenic Nesci, Carla Nesci, Minh Le, Emma",time:"9:30-12:30",type:"Special Event"},
  {name:"Westmead - Admin Day",attendees:"",bring:"",budget:"",date:"May 1, 2026",hospital:"Westmead",location:"",notes:"",staff:"Domenic Nesci",time:"",type:"Special Event"},
  {name:"POW - Nurses and Midwives Olympic",attendees:"300",bring:"",budget:"A$1,200.00",date:"May 14, 2026",hospital:"POW",location:"Edmonds Blacket Building Courtyards",notes:"Budget: $1,200",staff:"Domenic Nesci, Minh Le, Emma",time:"1-3pm",type:"Special Event"},
  {name:"POW - Afternoon Tea & Ceremony",attendees:"150",bring:"",budget:"",date:"May 15, 2026",hospital:"POW",location:"",notes:"",staff:"Georgia Wood",time:"1-3:30",type:"Afternoon Tea"},
  {name:"Campbelltown - BBQ Breakfast",attendees:"",bring:"",budget:"",date:"May 8, 2026",hospital:"CBH",location:"",notes:"",staff:"Domenic Nesci, Minh Le",time:"",type:"BBQ"},
  {name:"Camden BBQ Lunch",attendees:"",bring:"",budget:"",date:"May 11, 2026",hospital:"Camden",location:"",notes:"",staff:"Domenic Nesci, Emma",time:"",type:"BBQ"},
  {name:"Campbelltown - Staff Hampers",attendees:"",bring:"",budget:"",date:"May 12, 2026",hospital:"CBH",location:"",notes:"",staff:"Domenic Nesci, Minh Le",time:"",type:"Hamper Delivery"},
  {name:"RNSH Biggest Morning Tea",attendees:"",bring:"200-300 donuts (HHL sponsorship)",budget:"",date:"May 21, 2026",hospital:"RNS",location:"Acute Services Building - Main Foyer",notes:"200-300 donuts, HHL sponsorship",staff:"",time:"11:00am - 1:00pm",type:"Morning Tea"},
  {name:"Crazy Socks 4 Docs Day 2026",attendees:"",bring:"Custom branded socks, $100 lucky draw, gelato cart",budget:"",date:"June 5, 2026",hospital:"RNS",location:"Lecture Theatre Foyer, Barker St Randwick",notes:"Contact: Shahrear Chowdhury 0423 036 684. DATE IS PLACEHOLDER — confirm before committing.",staff:"",time:"9:00am - 11:00am",type:"Special Event"},
  {name:"Graduate Nurses & Midwives Orientation",attendees:"100",bring:"Stall setup for foyer",budget:"",date:"May 18, 2026",hospital:"Nepean",location:"Penrith Rugby League Club, Ron Mulock Room",notes:"Contact: Lorain. ~100 participants. Time TBC.",staff:"",time:"9am - 5pm",type:"Nurse Orientation"},
];

function buildEvents() {
  return RAW.map((r,i)=>{
    const dateStr=parseDate(r.date);
    const {time,endTime}=parseTime(r.time);
    const team=parseStaff(r.staff);
    const status=inferStatus(dateStr);
    const assignedStock=Object.fromEntries(team.map(m=>[m,{...ZK}]));
    return {
      id:i+1, name:r.name, eventType:r.type||"Stall", status,
      date:dateStr, time, endTime,
      address:r.location||"", suburb:r.hospital||"", state:"NSW", postcode:"",
      setupLocation:"", siteContactName:"", siteContactPhone:"", siteContactEmail:"",
      team, lead:team[0]||"", expectedAttendees:r.attendees||"",
      stock:{...DK}, assignedStock,
      notes:[r.notes, r.bring?`Bring: ${r.bring}`:""].filter(Boolean).join(" | "),
      budget:r.budget||"", leadsCapture:null, debrief:"",
    };
  });
}

const INITIAL_EVENTS = buildEvents();
const INITIAL_INV = {banner_promo:2,banner_brand:2,brochures:500,brochure_holder:3,pen_holder:3,pen_case:3,pens:200,tablecloth:3,mentos:50,mentos_holder:3};

const BLANK = { name:"",eventType:"Stall",status:"Confirmed",date:"",time:"",endTime:"",address:"",suburb:"",state:"NSW",postcode:"",setupLocation:"",siteContactName:"",siteContactPhone:"",siteContactEmail:"",team:[],lead:"",expectedAttendees:"",stock:{...DK},assignedStock:{},notes:"",budget:"",leadsCapture:null,debrief:"" };

function useLS(key,fallback){ const [v,setV]=useState(()=>{ try { const s=localStorage.getItem(key); return s?JSON.parse(s):fallback; } catch { return fallback; } }); useEffect(()=>{ try { localStorage.setItem(key,JSON.stringify(v)); } catch {} },[key,v]); return [v,setV]; }
function getAlloc(events){ const a=Object.fromEntries(STOCK_ITEMS.map(i=>[i.key,0])); events.filter(e=>e.status==="Confirmed"||e.status==="Tentative").forEach(e=>{ STOCK_ITEMS.forEach(i=>{ a[i.key]+=(e.stock[i.key]||0); }); }); return a; }
function totalAssigned(as,key){ return Object.values(as||{}).reduce((s,p)=>s+(p[key]||0),0); }

export default function App() {
  const [events,setEvents]=useLS("hhl_ev4",INITIAL_EVENTS);
  const [inventory,setInventory]=useLS("hhl_inv4",INITIAL_INV);
  const [marketingTasks,setMarketingTasks]=useLS("hhl_mkt1",{});
  const [zapierUrl,setZapierUrl]=useLS("hhl_zapier","");
  const [showSettings,setShowSettings]=useState(false);
  const [zapierStatus,setZapierStatus]=useState(null); // null | "sending" | "ok" | "err"
  const [view,setView]=useState("dashboard");
  const [selId,setSelId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState(BLANK);
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterType,setFilterType]=useState("All");
  const [filterHosp,setFilterHosp]=useState("All");
  const [stockTab,setStockTab]=useState("event");
  const [detailTab,setDetailTab]=useState("stock");
  const [mktAddForm,setMktAddForm]=useState(null);
  const [search,setSearch]=useState("");
  const [weekOffset,setWeekOffset]=useState(0);

  // Marketing helpers
  function getTasksForEvent(evId, eventType){
    if(marketingTasks[evId]&&marketingTasks[evId].length>0) return marketingTasks[evId];
    const tasks = getMktTemplate(eventType);
    setMarketingTasks(p=>({...p,[evId]:tasks}));
    return tasks;
  }
  function updateTask(evId, taskId, patch){
    setMarketingTasks(p=>({...p,[evId]:(p[evId]||[]).map(t=>t.id===taskId?{...t,...patch}:t)}));
  }
  function addCustomTask(evId, label, type, phase, assignee){
    const t={id:`c${Date.now()}`,phase,type,label,done:false,assignee,isCustom:true};
    setMarketingTasks(p=>({...p,[evId]:[...(p[evId]||[]),t]}));
  }
  function deleteTask(evId, taskId){
    setMarketingTasks(p=>({...p,[evId]:(p[evId]||[]).filter(t=>t.id!==taskId)}));
  }
  function regenerateTasks(evId, eventType){
    if(window.confirm("Replace all tasks with template defaults?"))
      setMarketingTasks(p=>({...p,[evId]:getMktTemplate(eventType)}));
  }

  const today=new Date().toISOString().split("T")[0];

  const mktBadge = (() => {
    let c=0;
    events.filter(e=>e.date>=today&&e.status!=="Cancelled").forEach(e=>{
      c+=(marketingTasks[e.id]||[]).filter(t=>!t.done).length;
    });
    return c;
  })();
  const alloc=getAlloc(events);
  const avail=Object.fromEntries(STOCK_ITEMS.map(i=>[i.key,(inventory[i.key]||0)-alloc[i.key]]));
  const upcoming=events.filter(e=>e.date>=today&&e.status!=="Cancelled");
  const sel=events.find(e=>e.id===selId);

  const weekDates=getWeekDates(weekOffset);
  const weekStart=weekDates[0], weekEnd=weekDates[6];
  const weekEvents=events.filter(e=>e.date>=weekStart&&e.date<=weekEnd&&e.status!=="Cancelled");
  const weekDone=weekEvents.filter(e=>e.status==="Completed").length;
  const weekTotal=weekEvents.length;
  const weekPct=weekTotal>0?Math.round((weekDone/weekTotal)*100):0;

  // target = 1 event per working day = 5/week
  const TARGET_PER_WEEK=5;
  const weekProgress=Math.min(100,Math.round((weekTotal/TARGET_PER_WEEK)*100));

  const eventsThisMonth=events.filter(e=>{ if(!e.date) return false; const d=new Date(e.date+"T12:00"); const n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); });

  function openNew(){ setForm({...BLANK,stock:{...DK},assignedStock:{}}); setShowForm(true); }
  function setF(k,v){ setForm(p=>({...p,[k]:v})); }
  function toggleMember(m){ const has=form.team.includes(m); const next=has?form.team.filter(x=>x!==m):[...form.team,m]; const as={...form.assignedStock}; if(!has) as[m]={...ZK}; else delete as[m]; setForm(p=>({...p,team:next,assignedStock:as})); }
  function setAssigned(member,key,val){ setForm(p=>({...p,assignedStock:{...p.assignedStock,[member]:{...p.assignedStock[member],[key]:Math.max(0,Number(val))}}})); }
  function setStock(key,val){ setForm(p=>({...p,stock:{...p.stock,[key]:Math.max(0,Number(val))}})); }
  function saveEvent(){
    if(!form.name||!form.date) return;
    const saved = form.id ? form : {...form, id:Date.now()};
    if(form.id) setEvents(prev=>prev.map(e=>e.id===form.id?saved:e));
    else setEvents(prev=>[...prev,saved]);
    // Fire Zapier
    if(zapierUrl) {
      setZapierStatus("sending");
      fireZapier(zapierUrl, saved).then(()=>setZapierStatus("ok")).catch(()=>setZapierStatus("err"));
      setTimeout(()=>setZapierStatus(null), 3000);
    }
    setShowForm(false);
    setForm(BLANK);
  }
  function editEvent(ev){ setForm({...ev}); setShowForm(true); }
  function deleteEvent(id){ if(window.confirm("Delete this event?")){ setEvents(prev=>prev.filter(e=>e.id!==id)); setSelId(null); } }

  let filtered=events;
  if(filterStatus!=="All") filtered=filtered.filter(e=>e.status===filterStatus);
  if(filterType!=="All") filtered=filtered.filter(e=>e.eventType===filterType);
  if(filterHosp!=="All") filtered=filtered.filter(e=>e.suburb===filterHosp);
  if(search) filtered=filtered.filter(e=>e.name.toLowerCase().includes(search.toLowerCase())||e.suburb.toLowerCase().includes(search.toLowerCase()));
  filtered=filtered.sort((a,b)=>a.date.localeCompare(b.date));

  const uniqueTypes=[...new Set(events.map(e=>e.eventType))].filter(Boolean).sort();
  const uniqueHosps=[...new Set(events.map(e=>e.suburb))].filter(Boolean).sort();

  const isCurrentWeek=weekOffset===0;
  const weekLabel=isCurrentWeek?"This week":weekOffset===-1?"Last week":weekOffset===1?"Next week":`Week of ${new Date(weekStart+"T12:00").toLocaleDateString("en-AU",{day:"numeric",month:"short"})}`;

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif;background:#f5f3ef;color:#1a1a1a;min-height:100vh}
    .app{max-width:960px;margin:0 auto;padding:20px 16px 80px}
    .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px}
    .logo{font-family:'DM Serif Display',serif;font-size:20px;color:#050554}
    .logo em{font-style:normal;background:#050554;color:#C6EAFD;padding:2px 9px;border-radius:5px;font-size:16px;margin-left:6px}
    .nav{display:flex;gap:3px;background:#ece8df;border-radius:10px;padding:3px}
    .nav button{background:none;border:none;padding:7px 15px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;color:#777;font-family:'DM Sans',sans-serif;transition:all .15s}
    .nav button.on{background:#fff;color:#050554;box-shadow:0 1px 4px rgba(0,0,0,.08)}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
    .stat{background:#fff;border-radius:12px;padding:14px 16px;border:.5px solid #e2ddd4}
    .stat-n{font-family:'DM Serif Display',serif;font-size:30px;color:#050554;line-height:1}
    .stat-l{font-size:11px;color:#999;margin-top:4px;font-weight:500}
    .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px}
    .st{font-size:15px;font-weight:600;color:#1a1a1a}
    .btn{border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap}
    .btn-p{background:#050554;color:#C6EAFD}.btn-p:hover{background:#0a0a7a}
    .btn-s{padding:5px 12px;font-size:12px}
    .btn-g{background:transparent;border:.5px solid #ddd;color:#555}.btn-g:hover{background:#eee}
    .btn-r{background:transparent;border:.5px solid #f7c1c1;color:#A32D2D}.btn-r:hover{background:#FCEBEB}
    .btn-icon{background:none;border:.5px solid #ddd;border-radius:7px;padding:5px 10px;font-size:14px;cursor:pointer;color:#555;line-height:1}
    .btn-icon:hover{background:#eee}
    .week-card{background:#fff;border-radius:14px;border:.5px solid #e2ddd4;padding:18px 20px;margin-bottom:20px}
    .week-nav{display:flex;align-items:center;gap:10px}
    .week-label{font-size:14px;font-weight:600;color:#1a1a1a;flex:1}
    .week-sub{font-size:12px;color:#999;margin-top:1px}
    .progress-track{height:10px;background:#f0ede6;border-radius:6px;overflow:hidden;margin:14px 0 6px;position:relative}
    .progress-fill{height:100%;border-radius:6px;transition:width .5s cubic-bezier(.4,0,.2,1)}
    .progress-label{display:flex;justify-content:space-between;font-size:11px;color:#aaa;font-weight:500}
    .day-cols{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:14px}
    .day-col{min-height:48px}
    .day-head{font-size:10px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;text-align:center}
    .day-date{font-size:11px;font-weight:500;text-align:center;margin-bottom:5px;padding:3px 0;border-radius:5px}
    .day-date.today{background:#050554;color:#C6EAFD}
    .day-date.past{color:#ccc}
    .day-event{border-radius:5px;padding:4px 5px;margin-bottom:3px;cursor:pointer;transition:opacity .15s;border-left:2px solid transparent}
    .day-event:hover{opacity:.8}
    .day-event-name{font-size:10px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .day-event-time{font-size:9px;opacity:.7;margin-top:1px}
    .day-more{font-size:10px;color:#aaa;text-align:center;margin-top:2px;cursor:pointer}
    .day-more:hover{color:#050554}
    .ecard{background:#fff;border-radius:12px;border:.5px solid #e2ddd4;padding:13px 16px;margin-bottom:8px;cursor:pointer;transition:all .15s}
    .ecard:hover{border-color:#050554;box-shadow:0 2px 10px rgba(5,5,84,.06)}
    .ecrow{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .en{font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:3px}
    .em{font-size:11px;color:#999;display:flex;gap:10px;flex-wrap:wrap}
    .lhd-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;vertical-align:middle;flex-shrink:0}
    .lhd-badge{display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;border-width:1px;border-style:solid}
    .badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px}
    .pill{font-size:11px;font-weight:500;padding:3px 9px;border-radius:20px;background:#eee8de;color:#777}
    .filters{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;align-items:center}
    .fb{background:none;border:.5px solid #ddd;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:500;cursor:pointer;color:#777;font-family:'DM Sans',sans-serif;transition:all .15s}
    .fb.on{background:#050554;border-color:#050554;color:#C6EAFD}
    .fsel{border:.5px solid #ddd;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:500;color:#555;font-family:'DM Sans',sans-serif;background:#fff;outline:none;cursor:pointer}
    .search{border:.5px solid #ddd;border-radius:20px;padding:6px 14px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;background:#fff;color:#1a1a1a;min-width:180px}
    .search:focus{border-color:#050554}
    .ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto}
    .modal{background:#fff;border-radius:16px;width:100%;max-width:660px;padding:28px;margin:auto}
    .mt{font-family:'DM Serif Display',serif;font-size:22px;color:#050554;margin-bottom:22px}
    .fg{margin-bottom:16px}
    .fl{font-size:11px;font-weight:600;color:#888;margin-bottom:5px;display:block;text-transform:uppercase;letter-spacing:.05em}
    .fi{width:100%;border:.5px solid #ddd;border-radius:8px;padding:9px 12px;font-size:14px;font-family:'DM Sans',sans-serif;color:#1a1a1a;background:#fafaf8;transition:border .15s;outline:none}
    .fi:focus{border-color:#050554;background:#fff}
    select.fi{appearance:none}
    textarea.fi{resize:vertical;min-height:72px}
    .frow{display:grid;gap:12px}
    .f2{grid-template-columns:1fr 1fr}
    .f3{grid-template-columns:1fr 1fr 1fr}
    .f4{grid-template-columns:2fr 1fr 1fr 80px}
    .tgrid{display:flex;gap:8px;flex-wrap:wrap}
    .tbtn{border:.5px solid #ddd;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:500;cursor:pointer;background:#fafaf8;color:#666;font-family:'DM Sans',sans-serif;transition:all .15s}
    .tbtn.on{background:#050554;border-color:#050554;color:#C6EAFD}
    .sgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
    .sitem{background:#f5f3ef;border-radius:8px;padding:9px 11px;display:flex;align-items:center;gap:8px}
    .sname{font-size:12px;font-weight:500;color:#555;flex:1;line-height:1.3}
    .snum{width:60px;border:.5px solid #ddd;border-radius:6px;padding:5px 7px;font-size:13px;font-weight:600;text-align:center;font-family:'DM Sans',sans-serif;background:#fff;outline:none;color:#1a1a1a}
    .divider{height:.5px;background:#ede9e0;margin:16px 0}
    .sub{font-size:12px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}
    .detail{background:#fff;border-radius:14px;border:.5px solid #e2ddd4;padding:24px}
    .dtitle{font-family:'DM Serif Display',serif;font-size:24px;color:#050554;margin-bottom:6px}
    .back{background:none;border:none;font-size:13px;color:#999;cursor:pointer;margin-bottom:16px;display:inline-flex;align-items:center;gap:4px;font-family:'DM Sans',sans-serif;padding:0}
    .back:hover{color:#050554}
    .ibox{background:#f5f3ef;border-radius:10px;padding:12px 14px;margin-bottom:10px}
    .ibl{font-size:11px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px}
    .ibv{font-size:14px;font-weight:500;color:#1a1a1a}
    .df label{font-size:11px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:.04em;display:block;margin-bottom:2px}
    .df p{font-size:14px;font-weight:500;color:#1a1a1a}
    .kitrow{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:#f5f3ef;border-radius:7px;margin-bottom:5px}
    .kname{font-size:12px;font-weight:500;color:#555}
    .kqty{font-size:14px;font-weight:700;color:#050554}
    .ptab{display:flex;gap:4px;margin-bottom:14px}
    .ptbtn{background:none;border:.5px solid #ddd;border-radius:7px;padding:6px 14px;font-size:12px;font-weight:500;cursor:pointer;color:#777;font-family:'DM Sans',sans-serif;transition:all .15s}
    .ptbtn.on{background:#050554;border-color:#050554;color:#C6EAFD}
    .pb{margin-bottom:14px}
    .ph{display:flex;align-items:center;gap:8px;margin-bottom:8px}
    .av{width:28px;height:28px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#185FA5;flex-shrink:0}
    .pn{font-size:14px;font-weight:600;color:#1a1a1a}
    .tag{display:inline-block;background:#eee8de;color:#777;font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:.04em}
    .inv-table{background:#fff;border:.5px solid #e2ddd4;border-radius:12px;overflow:hidden}
    .inv-hd{display:grid;grid-template-columns:1fr 80px 70px 80px;gap:10px;padding:10px 16px;border-bottom:.5px solid #ede9e0}
    .inv-th{font-size:11px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.05em}
    .inv-row{display:grid;grid-template-columns:1fr 80px 70px 80px;gap:10px;padding:10px 16px;border-bottom:.5px solid #f5f3ef;align-items:center}
    .inv-row:last-child{border-bottom:none}
    .bar{height:3px;background:#ede9e0;border-radius:2px;margin-top:4px;overflow:hidden}
    .bar-fill{height:100%;border-radius:2px}
    .ninp{width:60px;border:.5px solid #ddd;border-radius:6px;padding:5px 7px;font-size:13px;font-weight:600;text-align:center;font-family:'DM Sans',sans-serif;background:#f5f3ef;outline:none;color:#1a1a1a}
    .nv{font-size:14px;font-weight:700;text-align:right}
    .note{border-radius:8px;padding:10px 14px;font-size:12px;font-weight:500}
    .note-a{background:#FAEEDA;color:#633806}
    .empty{text-align:center;padding:40px;color:#bbb;font-size:14px}
    .budget-tag{display:inline-block;background:#e1f5ee;color:#085041;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;margin-left:8px}
    .legend{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .legend-item{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:#555}
    .mkt-phase{margin-bottom:18px}
    .mkt-phase-label{font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;display:flex;align-items:center;gap:8px}
    .mkt-phase-label::after{content:'';flex:1;height:.5px;background:#ede9e0}
    .mkt-task{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;border:.5px solid #ede9e0;background:#fff;margin-bottom:6px;transition:opacity .15s}
    .mkt-task.done{opacity:.45}
    .mkt-task-check{width:18px;height:18px;border-radius:5px;border:1.5px solid #ddd;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#fafaf8;transition:all .15s}
    .mkt-task-check.checked{background:#1D9E75;border-color:#1D9E75;color:#fff}
    .mkt-task-icon{font-size:13px;flex-shrink:0}
    .mkt-task-label{font-size:13px;font-weight:500;color:#1a1a1a;flex:1;line-height:1.4}
    .mkt-task-label.done{text-decoration:line-through;color:#bbb}
    .mkt-task-assignee{font-size:11px;font-weight:600;color:#555;background:#f0ede6;padding:2px 8px;border-radius:20px;white-space:nowrap;cursor:pointer}
    .mkt-task-del{font-size:11px;color:#ddd;cursor:pointer;padding:2px 5px;border-radius:4px;background:none;border:none;font-family:inherit}
    .mkt-task-del:hover{color:#E24B4A;background:#FCEBEB}
    .mkt-type-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;white-space:nowrap;flex-shrink:0}
    .mkt-add-row{display:grid;grid-template-columns:1fr 90px 90px 80px auto;gap:7px;align-items:center;margin-top:8px}
    .mkt-add-inp{border:.5px solid #ddd;border-radius:7px;padding:7px 10px;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;background:#fafaf8;color:#1a1a1a}
    .mkt-add-inp:focus{border-color:#050554}
    .mkt-global-event{background:#fff;border-radius:12px;border:.5px solid #e2ddd4;padding:14px 16px;margin-bottom:10px}
    .mkt-global-hdr{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;cursor:pointer}
    .mkt-progress-ring{position:relative;width:38px;height:38px;flex-shrink:0}
    .mkt-badge{display:inline-flex;align-items:center;justify-content:center;background:#E24B4A;color:#fff;font-size:10px;font-weight:700;border-radius:20px;padding:1px 6px;margin-left:4px;min-width:18px}
    .mkt-badge.zero{background:#1D9E75}
    .mkt-task-assignee-sel{font-size:11px;font-weight:600;color:#555;background:#f0ede6;padding:2px 8px;border-radius:20px;border:none;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif;appearance:none;-webkit-appearance:none}
    .mkt-task-assignee-sel:focus{outline:1.5px solid #050554}
    .settings-modal{background:#fff;border-radius:16px;width:100%;max-width:520px;padding:28px;margin:auto}
    .toast{position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,.12);display:flex;align-items:center;gap:8px}
    .toast-sending{background:#050554;color:#C6EAFD}
    .toast-ok{background:#1D9E75;color:#fff}
    .toast-err{background:#E24B4A;color:#fff}
    .help-box{background:#EEF2FF;border:.5px solid #6366f144;border-radius:10px;padding:14px 16px;margin-top:16px;font-size:12px;color:#3730a3;line-height:1.7}
    .help-box code{background:#c7d2fe;padding:1px 5px;border-radius:4px;font-size:11px}
  `;

  function EventCard({ev, onClick, compact=false}) {
    const c=lhd(ev.suburb);
    return (
      <div className="ecard" onClick={onClick} style={{borderColor:c.border+"44"}}>
        <div className="ecrow">
          <div style={{flex:1,minWidth:0}}>
            <div className="en">
              <span className="lhd-dot" style={{background:c.dot}}/>
              {ev.name}
              {ev.budget&&<span className="budget-tag">{ev.budget}</span>}
            </div>
            <div className="em">
              <span>{ev.date?new Date(ev.date+"T12:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"}):"No date"}</span>
              {ev.time&&<span>{ev.time}{ev.endTime?` – ${ev.endTime}`:""}</span>}
              <span style={{color:c.text,fontWeight:500}}>{ev.suburb}</span>
              {ev.lead&&<span>Lead: {ev.lead}</span>}
              {ev.team.length>0&&<span>{ev.team.join(", ")}</span>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
            <span className="badge" style={{background:STATUS_CFG[ev.status].bg,color:STATUS_CFG[ev.status].color}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:STATUS_CFG[ev.status].dot,display:"inline-block"}}/>
              {ev.status}
            </span>
            <span className="pill">{ev.eventType}</span>
          </div>
        </div>
      </div>
    );
  }

  // LHD legend for unique hospitals in current week
  const weekHospitals=[...new Set(weekEvents.map(e=>e.suburb))].filter(Boolean);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="hdr">
          <div className="logo">Healthcare Home Loans <em>Events</em></div>
          <nav className="nav">
            {["dashboard","events","marketing","inventory"].map(v=>(
              <button key={v} className={view===v?"on":""} onClick={()=>{setView(v);setSelId(null);}}>
                {v[0].toUpperCase()+v.slice(1)}
                {v==="marketing"&&mktBadge>0&&<span className="mkt-badge">{mktBadge}</span>}
              </button>
            ))}
          </nav>
          <button className="btn btn-g btn-s" onClick={()=>setShowSettings(true)} title="Settings">⚙️</button>
        </div>

        {view==="dashboard"&&<>
          <div className="stats">
            <div className="stat"><div className="stat-n">{events.length}</div><div className="stat-l">Total 2026</div></div>
            <div className="stat"><div className="stat-n">{upcoming.length}</div><div className="stat-l">Upcoming</div></div>
            <div className="stat"><div className="stat-n">{eventsThisMonth.length}</div><div className="stat-l">This month</div></div>
            <div className="stat"><div className="stat-n">{events.filter(e=>e.status==="Completed").length}</div><div className="stat-l">Completed</div></div>
          </div>

          {/* WEEKLY CARD */}
          <div className="week-card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:"#1a1a1a"}}>{weekLabel}</div>
                <div style={{fontSize:12,color:"#aaa",marginTop:2}}>
                  {new Date(weekStart+"T12:00").toLocaleDateString("en-AU",{day:"numeric",month:"short"})} – {new Date(weekEnd+"T12:00").toLocaleDateString("en-AU",{day:"numeric",month:"short"})}
                </div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button className="btn-icon" onClick={()=>setWeekOffset(w=>w-1)}>←</button>
                {weekOffset!==0&&<button className="btn btn-g btn-s" onClick={()=>setWeekOffset(0)}>Today</button>}
                <button className="btn-icon" onClick={()=>setWeekOffset(w=>w+1)}>→</button>
                <button className="btn btn-p btn-s" onClick={openNew}>+ New</button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-track">
              <div className="progress-fill" style={{
                width:`${weekProgress}%`,
                background: weekProgress>=100?"#1D9E75": weekProgress>=60?"#6366f1":"#050554",
              }}/>
            </div>
            <div className="progress-label">
              <span>{weekTotal} event{weekTotal!==1?"s":""} scheduled</span>
              <span style={{color:weekProgress>=100?"#1D9E75":weekProgress>=60?"#6366f1":"#aaa",fontWeight:600}}>
                {weekProgress>=100?"🎯 Week fully loaded!":weekProgress>=60?"Looking strong":"Building..."}
              </span>
              <span>Target: {TARGET_PER_WEEK}/week</span>
            </div>

            {/* Day columns */}
            <div className="day-cols">
              {weekDates.map((dateStr,di)=>{
                const dayEvs=weekEvents.filter(e=>e.date===dateStr).sort((a,b)=>a.time.localeCompare(b.time));
                const isToday=dateStr===today;
                const isPast=dateStr<today;
                const show=dayEvs.slice(0,3), extra=dayEvs.length-3;
                return (
                  <div key={dateStr} className="day-col">
                    <div className="day-head">{DAYS[di]}</div>
                    <div className={`day-date ${isToday?"today":isPast?"past":""}`}>
                      {new Date(dateStr+"T12:00").getDate()}
                    </div>
                    {show.map(ev=>{
                      const c=lhd(ev.suburb);
                      return (
                        <div key={ev.id} className="day-event"
                          style={{background:c.bg,borderLeftColor:c.border,borderLeftWidth:2,borderLeftStyle:"solid"}}
                          onClick={()=>{setSelId(ev.id);setView("events")}}>
                          <div className="day-event-name" style={{color:c.text}}>{ev.suburb}</div>
                          {ev.time&&<div className="day-event-time" style={{color:c.text}}>{ev.time}</div>}
                        </div>
                      );
                    })}
                    {extra>0&&<div className="day-more" onClick={()=>{setFilterStatus("All");setView("events")}}>+{extra} more</div>}
                    {dayEvs.length===0&&!isPast&&<div style={{height:4,borderRadius:2,background:"#f0ede6",marginTop:4}}/>}
                  </div>
                );
              })}
            </div>

            {/* LHD colour legend */}
            {weekHospitals.length>0&&<>
              <div className="divider" style={{margin:"12px 0 10px"}}/>
              <div className="legend">
                {weekHospitals.map(h=>{
                  const c=lhd(h);
                  return (
                    <div key={h} className="legend-item">
                      <span style={{width:8,height:8,borderRadius:"50%",background:c.dot,display:"inline-block",flexShrink:0}}/>
                      {h}
                    </div>
                  );
                })}
              </div>
            </>}
          </div>

          {/* Upcoming events list */}
          <div className="sh">
            <div className="st">Coming up next</div>
            <button className="btn btn-g btn-s" onClick={()=>setView("events")}>All events →</button>
          </div>
          {upcoming.sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(ev=>(
            <EventCard key={ev.id} ev={ev} onClick={()=>{setSelId(ev.id);setView("events")}}/>
          ))}
          {upcoming.length===0&&<div className="empty">No upcoming events.</div>}

          <div className="divider"/>
          <div className="sh"><div className="st">Inventory snapshot</div><button className="btn btn-g btn-s" onClick={()=>setView("inventory")}>Full inventory →</button></div>
          {STOCK_ITEMS.map(item=>{
            const tot=inventory[item.key]||0,av=avail[item.key]||0;
            const pct=tot>0?Math.round((av/tot)*100):100;
            const col=pct>50?"#1D9E75":pct>20?"#BA7517":"#E24B4A";
            return (
              <div key={item.key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:9}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:500,color:"#444"}}>{item.label}</span>
                    <span style={{fontSize:12,color:"#aaa"}}>{av}/{tot} {item.unit}</span>
                  </div>
                  <div className="bar"><div className="bar-fill" style={{width:`${Math.max(0,pct)}%`,background:col}}/></div>
                </div>
              </div>
            );
          })}
        </>}

        {view==="events"&&!selId&&<>
          <div className="sh">
            <div className="st">All events <span style={{fontWeight:400,color:"#aaa",fontSize:13}}>({filtered.length})</span></div>
            <button className="btn btn-p btn-s" onClick={openNew}>+ New event</button>
          </div>
          <div style={{marginBottom:10}}>
            <input className="search" placeholder="Search events or hospital..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="filters">
            {["All","Confirmed","Tentative","Completed","Cancelled"].map(s=>(
              <button key={s} className={`fb ${filterStatus===s?"on":""}`} onClick={()=>setFilterStatus(s)}>{s}</button>
            ))}
            <select className="fsel" value={filterType} onChange={e=>setFilterType(e.target.value)}>
              <option value="All">All types</option>
              {uniqueTypes.map(t=><option key={t}>{t}</option>)}
            </select>
            <select className="fsel" value={filterHosp} onChange={e=>setFilterHosp(e.target.value)}>
              <option value="All">All hospitals</option>
              {uniqueHosps.map(h=><option key={h}>{h}</option>)}
            </select>
          </div>
          {filtered.map(ev=>(
            <EventCard key={ev.id} ev={ev} onClick={()=>setSelId(ev.id)}/>
          ))}
          {filtered.length===0&&<div className="empty">No events match this filter.</div>}
        </>}

        {view==="events"&&selId&&sel&&(()=>{
          const ev=sel;
          const c=lhd(ev.suburb);
          return (
            <div className="detail" style={{borderColor:c.border+"55"}}>
              <button className="back" onClick={()=>setSelId(null)}>← Back</button>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                <div>
                  <div className="dtitle">{ev.name}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginTop:6,flexWrap:"wrap"}}>
                    <span className="badge" style={{background:STATUS_CFG[ev.status].bg,color:STATUS_CFG[ev.status].color}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:STATUS_CFG[ev.status].dot,display:"inline-block"}}/>
                      {ev.status}
                    </span>
                    <span className="lhd-badge" style={{background:c.bg,color:c.text,borderColor:c.border}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:c.dot,display:"inline-block",marginRight:4}}/>
                      {ev.suburb}
                    </span>
                    <span className="pill">{ev.eventType}</span>
                    {ev.budget&&<span className="budget-tag">{ev.budget}</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-g btn-s" onClick={()=>editEvent(ev)}>Edit</button>
                  <button className="btn btn-r btn-s" onClick={()=>deleteEvent(ev.id)}>Delete</button>
                </div>
              </div>
              <div className="divider"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div className="ibox">
                  <div className="ibl">Date & time</div>
                  <div className="ibv">{ev.date?new Date(ev.date+"T12:00").toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"TBC"}</div>
                  {(ev.time||ev.endTime)&&<div style={{fontSize:13,color:"#888",marginTop:2}}>{ev.time}{ev.endTime?` – ${ev.endTime}`:""}</div>}
                </div>
                <div className="ibox" style={{borderLeft:`3px solid ${c.border}`}}>
                  <div className="ibl">Hospital / Venue</div>
                  <div className="ibv" style={{color:c.text}}>{ev.suburb}</div>
                  {ev.address&&<div style={{fontSize:13,color:"#888",marginTop:2}}>{ev.address}</div>}
                </div>
              </div>
              {ev.setupLocation&&<div className="ibox"><div className="ibl">Setup location</div><div className="ibv">{ev.setupLocation}</div></div>}
              {(ev.siteContactName||ev.siteContactPhone||ev.siteContactEmail)&&<div className="ibox">
                <div className="ibl">Site contact</div>
                {ev.siteContactName&&<div className="ibv" style={{marginBottom:4}}>{ev.siteContactName}</div>}
                {ev.siteContactPhone&&<div style={{fontSize:13,color:"#555",marginBottom:2}}>📞 {ev.siteContactPhone}</div>}
                {ev.siteContactEmail&&<div style={{fontSize:13,color:"#555"}}>✉️ {ev.siteContactEmail}</div>}
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"12px 0"}}>
                <div className="df"><label>Lead</label><p>{ev.lead||"—"}</p></div>
                <div className="df"><label>Team</label><p>{ev.team.join(", ")||"—"}</p></div>
                <div className="df"><label>Expected</label><p>{ev.expectedAttendees||"—"}{ev.expectedAttendees?" people":""}</p></div>
              </div>
              {ev.notes&&<div style={{background:"#f5f3ef",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#555",marginBottom:12}}>{ev.notes}</div>}
              <div className="divider"/>
              <div className="st" style={{marginBottom:12}}>Stock & assignments</div>
              <div className="ptab">
                <button className={`ptbtn ${detailTab==="stock"&&stockTab==="event"?"on":""}`} onClick={()=>{setDetailTab("stock");setStockTab("event")}}>Event totals</button>
                <button className={`ptbtn ${detailTab==="stock"&&stockTab==="person"?"on":""}`} onClick={()=>{setDetailTab("stock");setStockTab("person")}}>By person</button>
                <button className={`ptbtn ${detailTab==="marketing"?"on":""}`} onClick={()=>setDetailTab("marketing")}>📋 Marketing</button>
              </div>
              {detailTab==="stock"&&stockTab==="event"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {STOCK_ITEMS.map(item=>(
                  <div key={item.key} className="kitrow">
                    <span className="kname">{item.label}</span>
                    <span className="kqty">{ev.stock[item.key]||0} <span style={{fontSize:10,color:"#aaa",fontWeight:400}}>{item.unit}</span></span>
                  </div>
                ))}
              </div>}
              {detailTab==="stock"&&stockTab==="person"&&(ev.team.length===0
                ?<div className="empty" style={{padding:24}}>No team members assigned yet.</div>
                :ev.team.map(member=>{
                  const ps=ev.assignedStock?.[member]||{};
                  const items=STOCK_ITEMS.filter(i=>(ps[i.key]||0)>0);
                  return (
                    <div key={member} className="pb">
                      <div className="ph">
                        <div className="av">{member.slice(0,2).toUpperCase()}</div>
                        <div className="pn">{member}</div>
                        {member===ev.lead&&<span className="tag">Lead</span>}
                      </div>
                      {items.length===0
                        ?<div style={{fontSize:12,color:"#bbb",paddingLeft:36}}>No stock assigned</div>
                        :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,paddingLeft:36}}>
                          {items.map(item=>(
                            <div key={item.key} className="kitrow" style={{padding:"5px 9px"}}>
                              <span className="kname">{item.label}</span>
                              <span className="kqty">{ps[item.key]}</span>
                            </div>
                          ))}
                        </div>}
                    </div>
                  );
                })
              )}
              {detailTab==="marketing"&&(()=>{
                const tasks=getTasksForEvent(ev.id, ev.eventType);
                const done=tasks.filter(t=>t.done).length;
                const total=tasks.length;
                const pct=total>0?Math.round((done/total)*100):0;
                return (
                  <div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{height:6,width:140,background:"#f0ede6",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#1D9E75":pct>50?"#6366f1":"#050554",borderRadius:3,transition:"width .4s"}}/>
                        </div>
                        <span style={{fontSize:12,color:"#888"}}>{done}/{total} done</span>
                      </div>
                      <div style={{display:"flex",gap:7}}>
                        <button className="btn btn-g btn-s" onClick={()=>setMktAddForm(mktAddForm===ev.id?null:ev.id)}>+ Add task</button>
                        <button className="btn btn-g btn-s" onClick={()=>regenerateTasks(ev.id,ev.eventType)}>Reset</button>
                      </div>
                    </div>
                    {mktAddForm===ev.id&&(()=>{
                      let newLabel="",newType="email",newPhase="Pre",newAssignee="Minh";
                      return (
                        <div style={{background:"#f5f3ef",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                          <div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>New task</div>
                          <div className="mkt-add-row">
                            <input className="mkt-add-inp" placeholder="Task description" onChange={e=>newLabel=e.target.value}/>
                            <select className="mkt-add-inp" onChange={e=>newType=e.target.value}>
                              {Object.keys(TASK_TYPE_CFG).map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                            <select className="mkt-add-inp" onChange={e=>newPhase=e.target.value}>
                              {PHASE_ORDER.map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                            <input className="mkt-add-inp" defaultValue="Minh" placeholder="Assignee" onChange={e=>newAssignee=e.target.value}/>
                            <button className="btn btn-p btn-s" onClick={()=>{if(newLabel.trim()){addCustomTask(ev.id,newLabel.trim(),newType,newPhase,newAssignee);setMktAddForm(null);}}}>Add</button>
                          </div>
                        </div>
                      );
                    })()}
                    {PHASE_ORDER.map(phase=>{
                      const phaseTasks=tasks.filter(t=>t.phase===phase);
                      if(phaseTasks.length===0) return null;
                      return (
                        <div key={phase} className="mkt-phase">
                          <div className="mkt-phase-label">{PHASE_LABELS[phase]}</div>
                          {phaseTasks.map(task=>{
                            const tc=TASK_TYPE_CFG[task.type]||TASK_TYPE_CFG.admin;
                            return (
                              <div key={task.id} className={`mkt-task${task.done?" done":""}`}>
                                <div className={`mkt-task-check${task.done?" checked":""}`} onClick={()=>updateTask(ev.id,task.id,{done:!task.done})}>{task.done&&"✓"}</div>
                                <span className="mkt-task-icon">{tc.icon}</span>
                                <span className={`mkt-task-label${task.done?" done":""}`}>{task.label}</span>
                                <span className="mkt-type-badge" style={{background:tc.bg,color:tc.color}}>{task.type}</span>
                                <select className="mkt-task-assignee-sel" value={task.assignee} onChange={e=>updateTask(ev.id,task.id,{assignee:e.target.value})}>
                                  {TEAM.map(m=><option key={m}>{m}</option>)}
                                </select>
                                {task.isCustom&&<button className="mkt-task-del" onClick={()=>deleteTask(ev.id,task.id)}>✕</button>}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {pct===100&&<div style={{textAlign:"center",padding:"18px 0",fontSize:13,color:"#1D9E75",fontWeight:600}}>✅ All marketing tasks complete for this event!</div>}
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {view==="marketing"&&(()=>{
          const upcomingMkt = events
            .filter(e=>e.date>=today&&e.status!=="Cancelled")
            .sort((a,b)=>a.date.localeCompare(b.date));

          return (<>
            <div className="sh">
              <div className="st">Marketing <span style={{fontWeight:400,color:"#aaa",fontSize:13}}>(upcoming events)</span></div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {mktBadge>0&&<span style={{fontSize:12,color:"#888"}}>{mktBadge} task{mktBadge!==1?"s":""} outstanding</span>}
              </div>
            </div>
            <div className="note note-a" style={{marginBottom:14}}>Tasks default to Minh. Click any assignee badge to reassign. Tick to complete. Click event name to open detail.</div>
            {upcomingMkt.length===0&&<div className="empty">No upcoming events.</div>}
            {upcomingMkt.map(ev=>{
              const tasks=getTasksForEvent(ev.id, ev.eventType);
              const done=tasks.filter(t=>t.done).length;
              const total=tasks.length;
              const pct=total>0?Math.round((done/total)*100):0;
              const incomplete=tasks.filter(t=>!t.done);
              const c=lhd(ev.suburb);
              const isAllDone=pct===100;

              return (
                <div key={ev.id} className="mkt-global-event" style={{borderColor: isAllDone?"#1D9E7544":c.border+"33"}}>
                  <div className="mkt-global-hdr" onClick={()=>{setSelId(ev.id);setDetailTab("marketing");setView("events");}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                        <span className="lhd-dot" style={{background:c.dot}}/>
                        <span style={{fontSize:14,fontWeight:600,color:"#1a1a1a"}}>{ev.name}</span>
                        <span style={{fontSize:11,color:c.text,fontWeight:600}}>{ev.date?new Date(ev.date+"T12:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"}):""}</span>
                      </div>
                      <div style={{marginTop:8}}>
                        <div style={{height:5,background:"#f0ede6",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:isAllDone?"#1D9E75":pct>50?"#6366f1":"#050554",borderRadius:3,transition:"width .4s"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                          <span style={{fontSize:11,color:"#aaa"}}>{done}/{total} tasks done</span>
                          <span style={{fontSize:11,fontWeight:600,color:isAllDone?"#1D9E75":"#aaa"}}>{isAllDone?"✅ All done!":`${total-done} left`}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{fontSize:11,color:"#050554",fontWeight:600,flexShrink:0,marginLeft:12}}>Open →</span>
                  </div>
                  {!isAllDone&&(
                    <div>
                      {PHASE_ORDER.map(phase=>{
                        const phaseTasks=incomplete.filter(t=>t.phase===phase);
                        if(phaseTasks.length===0) return null;
                        return (
                          <div key={phase}>
                            <div className="mkt-phase-label">{PHASE_LABELS[phase]}</div>
                            {phaseTasks.map(task=>{
                              const tc=TASK_TYPE_CFG[task.type]||TASK_TYPE_CFG.admin;
                              return (
                                <div key={task.id} className={`mkt-task${task.done?" done":""}`}>
                                  <div className={`mkt-task-check${task.done?" checked":""}`} onClick={()=>updateTask(ev.id,task.id,{done:!task.done})}>{task.done&&"✓"}</div>
                                  <span className="mkt-task-icon">{tc.icon}</span>
                                  <span className={`mkt-task-label${task.done?" done":""}`}>{task.label}</span>
                                  <span className="mkt-type-badge" style={{background:tc.bg,color:tc.color}}>{task.type}</span>
                                  <select className="mkt-task-assignee-sel" value={task.assignee} onChange={e=>updateTask(ev.id,task.id,{assignee:e.target.value})}>
                                    {TEAM.map(m=><option key={m}>{m}</option>)}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>);
        })()}

        {view==="inventory"&&<>
          <div className="sh"><div className="st">Inventory</div></div>
          <div className="inv-table">
            <div className="inv-hd">
              <span className="inv-th">Item</span>
              <span className="inv-th" style={{textAlign:"right"}}>Total</span>
              <span className="inv-th" style={{textAlign:"right",color:"#1D9E75"}}>Free</span>
              <span className="inv-th" style={{textAlign:"right",color:"#BA7517"}}>Allocated</span>
            </div>
            {STOCK_ITEMS.map(item=>{
              const tot=inventory[item.key]||0,al=alloc[item.key]||0,av=tot-al;
              const pct=tot>0?Math.round((av/tot)*100):100;
              const col=pct>50?"#1D9E75":pct>20?"#BA7517":"#E24B4A";
              return (
                <div key={item.key} className="inv-row">
                  <div><div style={{fontSize:13,fontWeight:500,color:"#1a1a1a"}}>{item.label}</div><div className="bar"><div className="bar-fill" style={{width:`${Math.max(0,pct)}%`,background:col}}/></div></div>
                  <div style={{textAlign:"right"}}><input type="number" className="ninp" value={tot} onChange={e=>setInventory(p=>({...p,[item.key]:Math.max(0,Number(e.target.value))}))}/><div style={{fontSize:10,color:"#bbb",marginTop:2,textAlign:"center"}}>{item.unit}</div></div>
                  <div className="nv" style={{color:av<0?"#E24B4A":"#1D9E75"}}>{av}</div>
                  <div className="nv" style={{color:al>0?"#BA7517":"#ccc"}}>{al}</div>
                </div>
              );
            })}
          </div>
          <div className="note note-a" style={{marginTop:12}}>Allocated = stock committed to confirmed + tentative events. Negative free = over-allocated.</div>
        </>}
      </div>

      {showForm&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="modal">
            <div className="mt">{form.id?"Edit event":"New event"}</div>
            <div className="fg"><label className="fl">Event name</label><input className="fi" value={form.name} onChange={e=>setF("name",e.target.value)}/></div>
            <div className="fg frow f2">
              <div><label className="fl">Event type</label><select className="fi" value={form.eventType} onChange={e=>setF("eventType",e.target.value)}>{ALL_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="fl">Status</label><select className="fi" value={form.status} onChange={e=>setF("status",e.target.value)}>{Object.keys(STATUS_CFG).map(s=><option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="fg frow f3">
              <div><label className="fl">Date</label><input type="date" className="fi" value={form.date} onChange={e=>setF("date",e.target.value)}/></div>
              <div><label className="fl">Start</label><input type="time" className="fi" value={form.time} onChange={e=>setF("time",e.target.value)}/></div>
              <div><label className="fl">End</label><input type="time" className="fi" value={form.endTime} onChange={e=>setF("endTime",e.target.value)}/></div>
            </div>
            <div className="divider"/>
            <div className="sub">Location</div>
            <div className="fg frow f2">
              <div><label className="fl">Hospital / Venue</label><select className="fi" value={form.suburb} onChange={e=>setF("suburb",e.target.value)}><option value="">Select hospital</option>{HOSPITALS.map(h=><option key={h}>{h}</option>)}</select></div>
              <div><label className="fl">Budget</label><input className="fi" placeholder="e.g. A$800.00" value={form.budget||""} onChange={e=>setF("budget",e.target.value)}/></div>
            </div>
            <div className="fg"><label className="fl">Address / building</label><input className="fi" value={form.address} onChange={e=>setF("address",e.target.value)}/></div>
            <div className="fg"><label className="fl">Setup location</label><input className="fi" placeholder="Exact spot on site" value={form.setupLocation} onChange={e=>setF("setupLocation",e.target.value)}/></div>
            <div className="divider"/>
            <div className="sub">Site contact</div>
            <div className="fg"><label className="fl">Contact name</label><input className="fi" value={form.siteContactName} onChange={e=>setF("siteContactName",e.target.value)}/></div>
            <div className="fg frow f2">
              <div><label className="fl">Phone</label><input className="fi" value={form.siteContactPhone} onChange={e=>setF("siteContactPhone",e.target.value)}/></div>
              <div><label className="fl">Email</label><input className="fi" value={form.siteContactEmail} onChange={e=>setF("siteContactEmail",e.target.value)}/></div>
            </div>
            <div className="divider"/>
            <div className="sub">Team</div>
            <div className="fg"><label className="fl">Attending</label><div className="tgrid">{TEAM.map(m=><button key={m} className={`tbtn ${form.team.includes(m)?"on":""}`} onClick={()=>toggleMember(m)}>{m}</button>)}</div></div>
            <div className="fg frow f2">
              <div><label className="fl">Lead</label><select className="fi" value={form.lead} onChange={e=>setF("lead",e.target.value)}><option value="">Select lead</option>{form.team.map(m=><option key={m}>{m}</option>)}</select></div>
              <div><label className="fl">Expected attendees</label><input type="number" className="fi" value={form.expectedAttendees} onChange={e=>setF("expectedAttendees",e.target.value)}/></div>
            </div>
            <div className="divider"/>
            <div className="sub">Event stock totals</div>
            <div className="sgrid">{STOCK_ITEMS.map(item=>(<div key={item.key} className="sitem"><span className="sname">{item.label}</span><input type="number" className="snum" value={form.stock[item.key]||0} onChange={e=>setStock(item.key,e.target.value)}/></div>))}</div>
            {form.team.length>0&&<>
              <div className="divider"/>
              <div className="sub">Assign stock per person</div>
              {form.team.map(member=>{
                const ps=form.assignedStock[member]||{};
                return (
                  <div key={member} className="pb">
                    <div className="ph"><div className="av">{member.slice(0,2).toUpperCase()}</div><div className="pn">{member}</div>{member===form.lead&&<span className="tag">Lead</span>}</div>
                    <div className="sgrid" style={{paddingLeft:36}}>
                      {STOCK_ITEMS.map(item=>{
                        const over=totalAssigned(form.assignedStock,item.key)>(form.stock[item.key]||0);
                        return (<div key={item.key} className="sitem" style={over?{border:"1px solid #f7c1c1"}:{}}><span className="sname">{item.label}</span><input type="number" className="snum" value={ps[item.key]||0} onChange={e=>setAssigned(member,item.key,e.target.value)} style={over?{borderColor:"#E24B4A",color:"#A32D2D"}:{}}/></div>);
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="note note-a" style={{marginTop:8}}>Red = over-assigned vs event total.</div>
            </>}
            <div className="divider"/>
            <div className="fg"><label className="fl">Notes</label><textarea className="fi" value={form.notes} onChange={e=>setF("notes",e.target.value)}/></div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
              <button className="btn btn-g" onClick={()=>setShowForm(false)}>Cancel</button>
              <button className="btn btn-p" onClick={saveEvent} disabled={!form.name||!form.date}>{form.id?"Save changes":"Create event"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ──────────────────────────────────────── */}
      {showSettings&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setShowSettings(false)}>
          <div className="settings-modal">
            <div className="mt">⚙️ Settings</div>

            <div className="fg">
              <label className="fl">Zapier Webhook URL</label>
              <input
                className="fi"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={zapierUrl}
                onChange={e=>setZapierUrl(e.target.value)}
              />
              <div style={{fontSize:11,color:"#aaa",marginTop:5}}>
                Fires when any event is created or updated. Sends full event details as JSON.
              </div>
            </div>

            <div className="help-box">
              <strong>How to get your Zapier webhook URL:</strong><br/>
              1. Go to <strong>zapier.com → Create Zap</strong><br/>
              2. Trigger: <strong>Webhooks by Zapier → Catch Hook</strong><br/>
              3. Copy the webhook URL Zapier gives you → paste above<br/>
              4. Action: choose what Zapier does (e.g. create Notion page, send Slack message, add row to Google Sheets)<br/>
              5. Save &amp; turn on the Zap<br/><br/>
              Every time you create or edit an event in HHL Events, Zapier will receive:<br/>
              <code>event_name</code> <code>event_type</code> <code>date</code> <code>hospital</code> <code>lead</code> <code>team</code> <code>status</code> <code>budget</code> + more
            </div>

            <div className="divider"/>

            <div className="fg">
              <label className="fl">Notion Embed — Deploy Instructions</label>
              <div className="help-box" style={{background:"#F0FDF4",borderColor:"#22c55e44",color:"#14532d"}}>
                <strong>Step 1 — Deploy to Vercel (free)</strong><br/>
                1. Go to <strong>github.com</strong> → create a new repo called <code>hhl-events</code><br/>
                2. Upload the 6 files from this project (App.jsx, main.jsx, index.html, package.json, vite.config.js — all in src/ where needed)<br/>
                3. Go to <strong>vercel.com</strong> → Add New Project → Import from GitHub<br/>
                4. Framework: <strong>Vite</strong>. Click Deploy.<br/>
                5. Vercel gives you a URL like <code>hhl-events.vercel.app</code><br/><br/>
                <strong>Step 2 — Embed in Notion</strong><br/>
                1. Open a Notion page<br/>
                2. Type <code>/embed</code> → select Embed<br/>
                3. Paste your Vercel URL<br/>
                4. Resize the embed block to full width<br/>
                5. Done — the full app lives inside Notion ✅<br/><br/>
                <strong>Note:</strong> localStorage persists per-device in the embed. For shared team state, you'd need a backend (Supabase or Airtable) — ask if you want that upgrade.
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
              <button className="btn btn-p" onClick={()=>setShowSettings(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ZAPIER TOAST ────────────────────────────────────────── */}
      {zapierStatus&&(
        <div className={`toast toast-${zapierStatus}`}>
          {zapierStatus==="sending"&&<>⚡ Sending to Zapier...</>}
          {zapierStatus==="ok"&&<>✅ Zapier notified</>}
          {zapierStatus==="err"&&<>⚠️ Zapier send failed — check URL in Settings</>}
        </div>
      )}
    </>
  );
}
