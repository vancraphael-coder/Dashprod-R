import React, { useState, useEffect, useRef, Component } from "react";
import { FEATURES } from "../config/features.js";

/* Portée v1 : les drapeaux de modules vivent dans src/config/features.js
   (source unique). Le code des modules coupés reste ici, inerte. */

/* ───────────────── THEME ───────────────── */
const C = {
  bg:"#F4F7FE", surf:"#FFFFFF", soft:"#F1F5FD", blue:"#2563EB", blueDk:"#1D4ED8", blueL:"#EFF6FF",
  text:"#0F172A", muted:"#64748B", faint:"#94A3B8", border:"#E4ECFC",
  green:"#059669", greenL:"#ECFDF5", amber:"#D97706", amberL:"#FFFBEB", red:"#DC2626", redL:"#FEF2F2",
  indigo:"#6366F1", navy:"#0F172A"
};
const FS = "'Fira Sans',system-ui,sans-serif";
const FC = "'Fira Code',ui-monospace,monospace";
let ME = "raphael.roovers@gmail.com", TEL = "0455/17.16.79", IBAN = "BE73 3101 6268 5860";
let CO_NAME="Déménagements Roovers SRL", CO_BCE="0478.363.616", CO_TVA="BE 0478.363.616", CO_ADDR="9 Rue de l'Avenir, 1370 Jodoigne";
let CFG_TVA=0.21, CFG_LIFT=125, CFG_KM=0.9, CFG_DEPOSIT=30, CFG_INVPREFIX="RV", CFG_PEPPOL_ON=false, CFG_PEPPOL_ID="0208:0478363616", CGV_TEXT="";

const sx = (...o)=>Object.assign({},...o);

function useFonts(){
  useEffect(()=>{
    if(!document.querySelector("[data-rfont]")){
      const l=document.createElement("link"); l.rel="stylesheet"; l.setAttribute("data-rfont","");
      l.href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    if(!document.querySelector("[data-rcss]")){
      const s=document.createElement("style"); s.setAttribute("data-rcss","");
      s.textContent=`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{margin:0;background:${C.bg}}
        input,select,textarea{font-family:${FS};font-size:16px;color:${C.text}}
        input:focus,select:focus,textarea:focus{outline:none;border-color:${C.blue}!important;box-shadow:0 0 0 3px rgba(37,99,235,.12)}
        input::placeholder,textarea::placeholder{color:#9aa6bd}
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        .nb::-webkit-scrollbar{display:none}.nb{-ms-overflow-style:none;scrollbar-width:none}
        select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px!important}
        @keyframes rUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
        @media print{
          body *{visibility:hidden!important}
          .print-contract,.print-contract *{visibility:visible!important}
          .print-contract{position:absolute!important;left:0;top:0;width:100%!important;border:none!important;box-shadow:none!important;border-radius:0!important}
          .no-print{display:none!important}
        }
      `;
      document.head.appendChild(s);
    }
  },[]);
}

/* ───────────────── ICONS ───────────────── */
function Ic({n,sz=16,c="currentColor",sw=1.9}){
  const a={fill:"none",stroke:c,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  const s={width:sz,height:sz,display:"block",flexShrink:0};
  const P={
    back:"M15 18l-6-6 6-6", plus:"M12 5v14M5 12h14", chevR:"m9 18 6-6-6-6",
    phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 15a19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 3.12 4.3h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 11.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
    mail:"M2 5h20v14H2zM2 6l10 7 10-7", user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    cal:"M3 5h18v17H3zM16 2v5M8 2v5M3 10h18", file:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8",
    euro:"M4 10h11M4 14h11M19 7a7 7 0 1 0 0 10", box:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22V12",
    truck:"M5 18H3V4h13v10M16 8h4l2 4v4h-4M7.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    check:"M20 6 9 17l-5-5", x:"M18 6 6 18M6 6l12 12", search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
    trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
    copy:"M9 9h13v13H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
    wa:"M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.3-5.4A8.4 8.4 0 1 1 21 11.5z",
    folder:"M3 7h6l2 2h10v9a2 2 0 0 1-2 2H3zM3 7V5a2 2 0 0 1 2-2h4l2 2", clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    alert:"M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
    map:"M9 20l-6 3V6l6-3 6 3 6-3v17l-6 3-6-3zM9 3v17M15 6v17", coins:"M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
    receipt:"M4 2v20l2.5-1.5L9 22l3-1.5L15 22l2.5-1.5L20 22V2l-2.5 1.5L15 2l-3 1.5L9 2 6.5 3.5 4 2zM8 8h8M8 12h8M8 16h5",
    pen:"M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z", archive:"M3 4h18v4H3zM5 8v12h14V8M9 12h6",
    lock:"M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3", shield:"M12 2 4 5v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5zM9 12l2 2 4-4",
    send:"M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z", print:"M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
    wrench:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    shirt:"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
    lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"
  };
  return <svg style={s} viewBox="0 0 24 24"><path d={P[n]||P.box} {...a}/></svg>;
}

/* ───────────────── HELPERS ───────────────── */
const uid=()=>Math.random().toString(36).slice(2,9);
const num=v=>{const n=parseFloat(String(v??"").replace(",","."));return isNaN(n)?0:n;};
const eur=v=>new Intl.NumberFormat("fr-BE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Math.round(num(v)));
const eur2=v=>new Intl.NumberFormat("fr-BE",{minimumFractionDigits:2,maximumFractionDigits:2}).format(num(v))+" €";
const pct=v=>(num(v)).toFixed(0)+" %";
const fmtS=d=>{try{return new Date(d+"T00:00").toLocaleDateString("fr-BE",{day:"numeric",month:"short"});}catch{return d||"";}};
const fmtL=d=>{try{return new Date(d+"T00:00").toLocaleDateString("fr-BE",{weekday:"long",day:"numeric",month:"long"});}catch{return d||"";}};
const todayStr=()=>new Date().toISOString().slice(0,10);
const dStat=(ech)=>{ if(!ech) return {l:"\u2014",c:"slate",d:null}; const ms=Math.round((new Date(ech)-new Date(todayStr()))/86400000); if(ms<0) return {l:"Expir\u00e9",c:"red",d:ms}; if(ms<=30) return {l:ms+" j",c:"amber",d:ms}; return {l:"Valide",c:"green",d:ms}; };

let RATES=[{w:2,h:85},{w:3,h:130},{w:4,h:170},{w:5,h:215},{w:6,h:255}];
const DEFAULT_SETTINGS={
  company:{name:"Déménagements Roovers SRL",bce:"0478.363.616",tvaNum:"BE 0478.363.616",iban:"BE73 3101 6268 5860",bic:"",addr:"9 Rue de l'Avenir, 1370 Jodoigne",email:"raphael.roovers@gmail.com",tel:"0455/17.16.79",site:""},
  peppol:{enabled:false,scheme:"0208",participant:"0478363616"},
  invoice:{prefix:"RV",next:"1",footer:"Merci de votre confiance."},
  rates:[{w:2,h:85},{w:3,h:130},{w:4,h:170},{w:5,h:215},{w:6,h:255}],
  prixKm:"0.9",lift:"125",depositPct:"30",
  material:[{k:"std",l:"Carton standard",p:"2"},{k:"livre",l:"Carton livre",p:"2.5"},{k:"pend",l:"Carton penderie",p:"8"},{k:"tape",l:"Tape",p:"3"},{k:"papier",l:"Rame papier",p:"6"},{k:"bulle",l:"Papier bulle",p:"15"},{k:"mousse",l:"Coins mousse",p:"4"}],
  margin:{min:"25",max:"45"},tva:"21",cgv:""
};
const STATUTS={devis:{l:"Devis",c:"slate"},confirme:{l:"Confirmé",c:"blue"},encours:{l:"En cours",c:"amber"},effectue:{l:"Effectué",c:"green"},annule:{l:"Annulé",c:"red"}};
const ROLES=["Chef d'équipe","Chauffeur","Déménageur"];
const ROLE_C={"Chef d'équipe":"indigo","Chauffeur":"blue","Déménageur":"slate"};
const PIECES=["Salon","Chambre","Cuisine","Salle de bain","Bureau","Cave/Garage","Autre"];
const QUICK={
  "Salon":["Canapé 3pl","Canapé 2pl","Fauteuil","Table basse","Meuble TV","Bibliothèque","Buffet","TV"],
  "Chambre":["Lit 160","Lit 140","Lit 90","Sommier","Matelas","Armoire 2p","Armoire 3p","Commode","Chevet"],
  "Cuisine":["Frigo","Lave-linge","Lave-vaisselle","Table","Chaise","Four","Congélateur"],
  "Salle de bain":["Meuble vasque","Colonne","Sèche-linge","Étagère"],
  "Bureau":["Bureau","Chaise bureau","Étagère","Caisson"],
  "Cave/Garage":["Vélo","Tondeuse","Établi","Étagère métal","Caisse"],
  "Autre":["Piano","Coffre-fort","Miroir","Plante"]
};
const VOL={"canapé 3":1.2,"canapé 2":0.9,"canapé":1,"fauteuil":0.5,"table basse":0.3,"meuble tv":0.4,"bibliothèque":0.8,"buffet":0.9,"tv":0.2,"armoire 3":1.8,"armoire 2":1.2,"armoire":1.4,"lit 160":0.9,"lit 140":0.8,"lit 90":0.5,"sommier":0.6,"matelas":0.4,"commode":0.5,"chevet":0.15,"frigo":0.6,"congélateur":0.5,"lave-linge":0.5,"lave-vaisselle":0.5,"four":0.15,"table":0.6,"chaise":0.15,"bureau":0.7,"étagère":0.4,"vélo":0.5,"tondeuse":0.4,"caisse":0.1,"piano":1.5,"coffre":0.8,"miroir":0.2,"default":0.3};
const getVol=n=>{const s=(n||"").toLowerCase();for(const[k,v]of Object.entries(VOL))if(k!=="default"&&s.includes(k))return v;return VOL.default;};
const EMB=[{k:"std",l:"Carton standard"},{k:"livre",l:"Carton livre"},{k:"pend",l:"Carton penderie"},{k:"tape",l:"Tape"},{k:"papier",l:"Rame papier"},{k:"bulle",l:"Papier bulle"},{k:"mousse",l:"Coins mousse"}];
let TARGET={min:25,max:45};
const CGV=[
  "1. Acompte & réservation. La date est réservée à réception d'un acompte de 30 %. Le solde est payable au plus tard le jour de la prestation, par virement (IBAN ci-dessous).",
  "2. Tarif horaire. Les heures sont décomptées du départ du dépôt jusqu'au retour, par tranche commencée. Le devis horaire est une estimation ; seules les heures réellement prestées sont facturées.",
  "3. Accès & stationnement. Le client garantit un accès libre et un emplacement de stationnement aux deux adresses. Les frais, attentes ou portages supplémentaires dus à un accès non conforme sont à sa charge.",
  "4. Responsabilité & assurance. Roovers est assurée pour les dommages causés par sa faute lors de la manutention. Les objets de valeur, documents, espèces et biens fragiles non signalés restent sous la garde du client.",
  "5. Réclamations. Tout dommage apparent doit être signalé le jour même et confirmé par écrit dans les 48 heures ; à défaut, la prestation est réputée conforme.",
  "6. Annulation. Toute annulation à moins de 7 jours peut donner lieu à la retenue de l'acompte au titre de l'immobilisation de l'équipe.",
  "7. Droit applicable. Le présent contrat est régi par le droit belge ; tout litige relève des tribunaux compétents de l'arrondissement du siège. TVA 21 % applicable."
];

function newDossier(p={}){
  return {id:uid(),nom:"",tel:"",mail:"",tva:"",societe:"",
    adresseCharge:"",adresseDecharge:"",adresseFact:"",
    dateDem:"",dateEmballage:"",heureDem:"08:00",heureEmballage:"08:00",nbDem:3,camions:[],vehicules:"",remarques:"",
    equipe:[], km:"",dureeTrajet:"",prixKm:"",peages:"",
    statut:"devis",archive:false,inventaire:[],
    tarifMode:"horaire",heures:"",prixHTVAh:130,forfaitTVAC:"",optLift:0,reductionPct:"",reductionType:"promo",
    coutMOheures:"",coutMOtaux:32,coutCarburant:"",coutMateriel:"",coutDivers:"",
    emballage:{},factureNum:"",factureDate:"",facturePayee:false,facturePayeeLe:"",factureNotes:"",
    mailEnvoye:false,mailEnvoyeLe:"",signature:"",signatureNom:"",signatureDate:"",
    chronoStart:null,chronoAcc:0,pending:false,createdByName:"",
    createdAt:new Date().toISOString(),...p};
}
const SEED_TEAM=[
  {id:"t1",nom:"Cédric H.",role:"Chef d'équipe",tel:"0478/11.22.33",actif:true,conges:[],
    paye:"16.5",payeType:"CDI",canQuote:true,
    equip:{chaussures:{etat:"usé",remplacer:false},visseuse:{etat:"à remplacer",remplacer:true}},
    docs:{ci:{scan:true,ech:"2031-05-12"},permis:{scan:true,ech:"2027-09-30"},contrat:{scan:true,ech:""},medical:{scan:true,ech:"2026-10-01"}}},
  {id:"t2",nom:"Dylan V.",role:"Chauffeur",tel:"0479/44.55.66",actif:true,conges:[],
    paye:"15",payeType:"CDI",canQuote:true,
    equip:{veste:{etat:"à remplacer",remplacer:true}},
    docs:{ci:{scan:true,ech:"2029-03-04"},permis:{scan:true,ech:"2026-07-20"},contrat:{scan:true,ech:""},medical:{scan:false,ech:""}}},
  {id:"t3",nom:"Marc T.",role:"Déménageur",tel:"0468/77.88.99",actif:true,conges:[],paye:"14",payeType:"Intérim",canQuote:false,equip:{},docs:{}},
  {id:"t4",nom:"Kevin S.",role:"Déménageur",tel:"0472/99.88.77",actif:true,conges:[{id:uid(),from:"2026-07-01",to:"2026-07-15"}],paye:"14",payeType:"Intérim",canQuote:false,equip:{},docs:{}}
];
const PAYE_TYPES=["CDI","CDD","Intérim","Sous-traitant","Étudiant"];
const ETATS=[{v:"neuf",l:"Neuf",c:"green"},{v:"bon",l:"Bon",c:"blue"},{v:"usé",l:"Usé",c:"amber"},{v:"à remplacer",l:"À remplacer",c:"red"}];
const EQUIP=[
  {g:"Vêtements",ic:"shirt",items:[["gants","Gants"],["veste","Veste"],["pull","Pull"],["polo","Polo"],["tshirt","Tee-shirt"],["pantalon","Pantalon"],["short","Short"],["chaussures","Chaussures de sécu"]]},
  {g:"Outils",ic:"wrench",items:[["visseuse","Visseuse"],["chargeur","Chargeur visseuse"],["embouts","Boîte à embouts"],["tournevis","Tournevis porte-embouts"],["marteau","Marteau"],["cle","Clé à molette"]]}
];
const DOCS=[{k:"ci",l:"Carte d'identité",ech:true},{k:"permis",l:"Permis de conduire",ech:true},{k:"contrat",l:"Contrat de travail",ech:false},{k:"medical",l:"Visite médicale",ech:true}];
const MECA={ok:{l:"OK",c:"green"},surveiller:{l:"À surveiller",c:"amber"},urgent:{l:"URGENT",c:"red"}};
const SEED_TRUCKS=[
  {id:"v1",nom:"Sprinter 591",type:"Fourgon",vol:20,immat:"1-ABC-591",ctEch:"2026-11-15",assurEch:"2027-01-01",assurScan:true,etatMeca:"ok",etatNote:"",etatDate:""},
  {id:"v2",nom:"Atego 1222",type:"Porteur",vol:40,immat:"1-DEF-122",ctEch:"2026-07-08",assurEch:"2026-12-01",assurScan:true,etatMeca:"surveiller",etatNote:"Plaquettes de frein avant à surveiller.",etatDate:"2026-06-10"},
  {id:"v3",nom:"Master",type:"Fourgon",vol:12,immat:"1-GHI-820",ctEch:"2027-02-20",assurEch:"2027-01-01",assurScan:false,etatMeca:"ok",etatNote:"",etatDate:""},
  {id:"v4",nom:"Cabstar lift",type:"Hayon élévateur",vol:19,immat:"1-JKL-330",ctEch:"2026-06-05",assurEch:"2026-09-15",assurScan:true,etatMeca:"urgent",etatNote:"Hayon ne tient plus en position haute — ne pas utiliser.",etatDate:"2026-06-20"}
];
const SEED=[
  newDossier({id:"d1",nom:"Martin Lecomte",tel:"0477/33.22.11",mail:"martin.l@gmail.com",
    adresseCharge:"Rue des Tulipes 14, 1300 Wavre",adresseDecharge:"Avenue Louise 88, 1050 Bruxelles",
    dateDem:"2026-06-29",heureDem:"08:00",nbDem:3,statut:"confirme",remarques:"Piano au salon. Cuisine IKEA.",
    equipe:["t1","t2","t3"],camions:["v1"],km:25,dureeTrajet:"35 min",peages:0,
    heures:6,prixHTVAh:130,coutMOheures:12,coutMOtaux:32,coutCarburant:45,coutMateriel:30,
    inventaire:[{id:uid(),name:"Piano",room:"Salon",qty:1},{id:uid(),name:"Canapé 3pl",room:"Salon",qty:1},{id:uid(),name:"Lit 160",room:"Chambre",qty:1},{id:uid(),name:"Frigo",room:"Cuisine",qty:1}]}),
  newDossier({id:"d2",nom:"Sophie Dubois",tel:"0465/55.44.33",mail:"sophie.d@outlook.com",
    adresseCharge:"Chaussée de Namur 55, 1370 Jodoigne",adresseDecharge:"Rue de la Station 12, 1325 Limal",
    dateDem:"2026-07-04",heureDem:"08:30",nbDem:4,statut:"confirme",remarques:"2 camions nécessaires.",
    equipe:["t1","t2","t3"],camions:["v1","v2"],
    heures:8,prixHTVAh:170,coutMOheures:24,coutMOtaux:32,coutCarburant:70,coutMateriel:50,
    inventaire:[{id:uid(),name:"Canapé 3pl",room:"Salon",qty:1},{id:uid(),name:"Table",room:"Cuisine",qty:1},{id:uid(),name:"Armoire 2p",room:"Chambre",qty:2}]}),
  newDossier({id:"d3",nom:"Julie Bernard",tel:"0471/77.66.55",mail:"julie.b@gmail.com",
    adresseCharge:"Rue du Château 3, 5000 Namur",adresseDecharge:"Clos des Lilas 8, 1300 Wavre",
    dateDem:"2026-07-10",heureDem:"09:00",nbDem:3,statut:"devis",remarques:"Accès difficile. Rue étroite.",
    equipe:["t1","t2"],camions:["v3"],
    heures:6,prixHTVAh:130,coutMOheures:12,coutMOtaux:30,coutCarburant:50,coutMateriel:30,
    inventaire:[{id:uid(),name:"Canapé 2pl",room:"Salon",qty:1},{id:uid(),name:"Lit 90",room:"Chambre",qty:2}]}),
  newDossier({id:"d4",nom:"Pierre Dupont",tel:"0488/11.99.88",mail:"pierre.d@gmail.com",
    adresseCharge:"Rue du Centre 7, 5030 Gembloux",adresseDecharge:"Bd du Jardin 22, 1000 Bruxelles",
    dateDem:"2026-05-20",heureDem:"07:30",nbDem:2,statut:"effectue",factureNum:"RV-2026-002",factureDate:"2026-05-20",facturePayee:true,facturePayeeLe:"2026-05-22",
    equipe:["t1","t3"],camions:["v1"],
    heures:4,prixHTVAh:85,coutMOheures:8,coutMOtaux:32,coutCarburant:30,coutMateriel:15,
    inventaire:[{id:uid(),name:"Frigo",room:"Cuisine",qty:1},{id:uid(),name:"Canapé 2pl",room:"Salon",qty:1}]})
];

/* ───────────────── COMPUTE ───────────────── */
function compute(d){
 try{
  d=d||{};
  const moLines = Array.isArray(d.moLines)&&d.moLines.length ? d.moLines : [{h:d.coutMOheures||0,taux:d.coutMOtaux||32}];
  const recetteH=num(d.heures)*num(d.prixHTVAh);
  const optLift=num(d.optLift);
  const base=recetteH+optLift;
  const remise=base*num(d.reductionPct)/100;
  let htva = d.tarifMode==="forfait" ? num(d.forfaitTVAC)/(1+CFG_TVA) : (base-remise);
  const tva=htva*CFG_TVA, tvac=htva+tva;
  const mo=moLines.reduce((s,l)=>s+num(l.h)*num(l.taux),0);
  const carb=num(d.coutCarburant), mat=num(d.coutMateriel), div=num(d.coutDivers), peg=num(d.peages);
  const kmCost=num(d.km)*num(d.prixKm);
  const couts=mo+carb+mat+div+peg+kmCost;
  const marge=htva-couts;
  const margePct=htva>0?marge/htva*100:0;
  let zone="bas",zc=C.red;
  if(margePct>=TARGET.min&&margePct<=TARGET.max){zone="cible";zc=C.green;}
  else if(margePct>TARGET.max){zone="haut";zc=C.indigo;}
  return {recetteH,optLift,base,remise,htva,tva,tvac,mo,carb,mat,div,peg,kmCost,couts,marge,margePct,zone,zc};
 }catch(e){ return {recetteH:0,optLift:0,base:0,remise:0,htva:0,tva:0,tvac:0,mo:0,carb:0,mat:0,div:0,peg:0,kmCost:0,couts:0,marge:0,margePct:0,zone:"bas",zc:C.red}; }
}

/* ───────────────── MESSAGERIE E2EE (ECDH P-256 · AES-256-GCM · ECDSA) ───────────────── */
const _SUB=()=>(globalThis.crypto&&globalThis.crypto.subtle)?globalThis.crypto.subtle:null;
const cryptoOK=()=>!!_SUB();
const _RAND=n=>globalThis.crypto.getRandomValues(new Uint8Array(n));
const _te=new TextEncoder(), _td=new TextDecoder();
const _b64=buf=>btoa(String.fromCharCode.apply(null,new Uint8Array(buf)));
const _ub64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const _EC={name:"ECDH",namedCurve:"P-256"}, _DS={name:"ECDSA",namedCurve:"P-256"};
async function genIdentity(){ const S=_SUB(); const ec=await S.generateKey(_EC,true,["deriveKey"]); const sg=await S.generateKey(_DS,true,["sign","verify"]); return {ecdhPriv:await S.exportKey("jwk",ec.privateKey),ecdhPub:await S.exportKey("jwk",ec.publicKey),ecdsaPriv:await S.exportKey("jwk",sg.privateKey),ecdsaPub:await S.exportKey("jwk",sg.publicKey)}; }
const _impEcdhPriv=j=>_SUB().importKey("jwk",j,_EC,false,["deriveKey"]);
const _impEcdhPub=j=>_SUB().importKey("jwk",j,_EC,false,[]);
const _impEcdsaPriv=j=>_SUB().importKey("jwk",j,_DS,false,["sign"]);
const _impEcdsaPub=j=>_SUB().importKey("jwk",j,_DS,false,["verify"]);
async function _kek(myPriv,theirPub){ const priv=await _impEcdhPriv(myPriv),pub=await _impEcdhPub(theirPub); return _SUB().deriveKey({name:"ECDH",public:pub},priv,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]); }
async function encryptFor(plaintext,recipients,me){ const S=_SUB(); const msgKey=await S.generateKey({name:"AES-GCM",length:256},true,["encrypt","decrypt"]); const iv=_RAND(12); const ct=await S.encrypt({name:"AES-GCM",iv},msgKey,_te.encode(plaintext)); const rawKey=await S.exportKey("raw",msgKey); const keys=[]; for(const r of recipients){ if(!r||!r.ecdhPub)continue; const k=await _kek(me.ecdhPriv,r.ecdhPub); const wiv=_RAND(12); const wk=await S.encrypt({name:"AES-GCM",iv:wiv},k,rawKey); keys.push({to:r.id,iv:_b64(wiv),k:_b64(wk)}); } const sg=await _impEcdsaPriv(me.ecdsaPriv); const sig=await S.sign({name:"ECDSA",hash:"SHA-256"},sg,ct); return {iv:_b64(iv),ct:_b64(ct),keys,sig:_b64(sig)}; }
async function decryptFrom(env,myId,myPriv,senderEcdhPub,senderEcdsaPub){ const S=_SUB(); const mine=(env.keys||[]).find(k=>k.to===myId); if(!mine)return {text:null,ok:false,reason:"not-recipient"}; const k=await _kek(myPriv,senderEcdhPub); const rawKey=await S.decrypt({name:"AES-GCM",iv:_ub64(mine.iv)},k,_ub64(mine.k)); const msgKey=await S.importKey("raw",rawKey,{name:"AES-GCM"},false,["decrypt"]); const pt=await S.decrypt({name:"AES-GCM",iv:_ub64(env.iv)},msgKey,_ub64(env.ct)); let verified=false; try{ const vp=await _impEcdsaPub(senderEcdsaPub); verified=await S.verify({name:"ECDSA",hash:"SHA-256"},vp,_ub64(env.sig),_ub64(env.ct)); }catch(e){} return {text:_td.decode(pt),ok:true,verified}; }
async function fingerprint(ecdhPub){ try{ const h=await _SUB().digest("SHA-256",_te.encode((ecdhPub.x||"")+(ecdhPub.y||""))); return [...new Uint8Array(h)].slice(0,10).map(b=>b.toString(16).padStart(2,"0")).join("").match(/.{4}/g).join(" "); }catch(e){ return "—"; } }

/* ───────────────── PEPPOL / UBL (EN 16931 · BIS Billing 3.0) ───────────────── */
const onlyDigits=s=>String(s==null?"":s).replace(/\D/g,"");
const bceDigits=s=>{ const d=onlyDigits(s); return d.length>=10?d.slice(-10):d.padStart(10,"0"); };
const normVat=s=>{ const d=onlyDigits(s); return d?("BE"+(d.length>=10?d.slice(-10):d.padStart(10,"0"))):""; };
const peppolFromVat=s=>{ const d=onlyDigits(s); return d?("0208:"+(d.length>=10?d.slice(-10):d.padStart(10,"0"))):""; };
const isB2B=d=> (d&&d.clientPro!==undefined) ? !!d.clientPro : !!(d&&d.tva&&String(d.tva).trim());
const ogmBase=d=>{ const src=onlyDigits(d&&d.factureNum)||onlyDigits(d&&d.id)||"1"; return (src+"0000000000").slice(0,10); };
const ogmCom=base=>{ try{ const b=(String(base)+"0000000000").slice(0,10); let c=Number(b)%97; if(c===0)c=97; const dd=b+String(c).padStart(2,"0"); return "+++"+dd.slice(0,3)+"/"+dd.slice(3,7)+"/"+dd.slice(7,12)+"+++"; }catch(e){ return "+++000/0000/00000+++"; } };
const parseBEAddr=s=>{ const t=String(s==null?"":s).trim(); const m=t.match(/(.*?)[,\s]+(\d{4})\s+(.+)$/); if(m) return {street:m[1].replace(/,$/,"").trim(),postal:m[2],city:m[3].trim()}; return {street:t,postal:"",city:""}; };
const xmlEsc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const f2=n=>num(n).toFixed(2);
function buildUBL(d,comp,opts){
  opts=opts||{}; const seller=opts.seller||{}; const ogm=opts.ogm||ogmCom(ogmBase(d));
  const rate=Math.round(CFG_TVA*100); const acompte=num(d.acompte);
  const net=num(comp.htva), vat=num(comp.tva), gross=num(comp.tvac); const payable=gross-acompte;
  const inv=d.factureNum||(CFG_INVPREFIX+"-2026-XXXX"); const issue=d.factureDate||todayStr(); const due=d.factureDate||todayStr();
  const svc=d.dateDem||issue; const sA=parseBEAddr(seller.addr); const bA=opts.buyerAddr||parseBEAddr("");
  const bName=d.societe||d.nom||"Client"; const bVat=normVat(d.tva); const bDig=bceDigits(d.tva);
  const desc=opts.desc||"Déménagement"; const ibanS=String(seller.iban||"").replace(/\s/g,"");
  const L=[];
  L.push('<?xml version="1.0" encoding="UTF-8"?>');
  L.push('<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">');
  L.push('  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>');
  L.push('  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>');
  L.push('  <cbc:ID>'+xmlEsc(inv)+'</cbc:ID>');
  L.push('  <cbc:IssueDate>'+issue+'</cbc:IssueDate>');
  L.push('  <cbc:DueDate>'+due+'</cbc:DueDate>');
  L.push('  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>');
  L.push('  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>');
  L.push('  <cbc:BuyerReference>'+xmlEsc(d.nom||inv)+'</cbc:BuyerReference>');
  L.push('  <cac:InvoicePeriod><cbc:StartDate>'+svc+'</cbc:StartDate><cbc:EndDate>'+svc+'</cbc:EndDate></cac:InvoicePeriod>');
  L.push('  <cac:AccountingSupplierParty><cac:Party>');
  L.push('    <cbc:EndpointID schemeID="0208">'+bceDigits(seller.bce)+'</cbc:EndpointID>');
  L.push('    <cac:PartyIdentification><cbc:ID schemeID="0208">'+bceDigits(seller.bce)+'</cbc:ID></cac:PartyIdentification>');
  L.push('    <cac:PartyName><cbc:Name>'+xmlEsc(seller.name)+'</cbc:Name></cac:PartyName>');
  L.push('    <cac:PostalAddress><cbc:StreetName>'+xmlEsc(sA.street)+'</cbc:StreetName><cbc:CityName>'+xmlEsc(sA.city)+'</cbc:CityName><cbc:PostalZone>'+xmlEsc(sA.postal)+'</cbc:PostalZone><cac:Country><cbc:IdentificationCode>BE</cbc:IdentificationCode></cac:Country></cac:PostalAddress>');
  L.push('    <cac:PartyTaxScheme><cbc:CompanyID>'+xmlEsc(seller.vat)+'</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>');
  L.push('    <cac:PartyLegalEntity><cbc:RegistrationName>'+xmlEsc(seller.name)+'</cbc:RegistrationName><cbc:CompanyID schemeID="0208">'+bceDigits(seller.bce)+'</cbc:CompanyID></cac:PartyLegalEntity>');
  L.push('    <cac:Contact><cbc:Name>'+xmlEsc(seller.contact)+'</cbc:Name><cbc:Telephone>'+xmlEsc(onlyDigits(seller.tel))+'</cbc:Telephone><cbc:ElectronicMail>'+xmlEsc(seller.email)+'</cbc:ElectronicMail></cac:Contact>');
  L.push('  </cac:Party></cac:AccountingSupplierParty>');
  L.push('  <cac:AccountingCustomerParty><cac:Party>');
  L.push('    <cbc:EndpointID schemeID="0208">'+bDig+'</cbc:EndpointID>');
  L.push('    <cac:PartyIdentification><cbc:ID schemeID="0208">'+bDig+'</cbc:ID></cac:PartyIdentification>');
  L.push('    <cac:PartyName><cbc:Name>'+xmlEsc(bName)+'</cbc:Name></cac:PartyName>');
  L.push('    <cac:PostalAddress><cbc:StreetName>'+xmlEsc(bA.street)+'</cbc:StreetName><cbc:CityName>'+xmlEsc(bA.city)+'</cbc:CityName><cbc:PostalZone>'+xmlEsc(bA.postal)+'</cbc:PostalZone><cac:Country><cbc:IdentificationCode>BE</cbc:IdentificationCode></cac:Country></cac:PostalAddress>');
  if(bVat) L.push('    <cac:PartyTaxScheme><cbc:CompanyID>'+xmlEsc(bVat)+'</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>');
  L.push('    <cac:PartyLegalEntity><cbc:RegistrationName>'+xmlEsc(bName)+'</cbc:RegistrationName><cbc:CompanyID schemeID="0208">'+bDig+'</cbc:CompanyID></cac:PartyLegalEntity>');
  L.push('  </cac:Party></cac:AccountingCustomerParty>');
  L.push('  <cac:PaymentMeans><cbc:PaymentMeansCode>30</cbc:PaymentMeansCode><cbc:PaymentID>'+xmlEsc(ogm)+'</cbc:PaymentID><cac:PayeeFinancialAccount><cbc:ID>'+xmlEsc(ibanS)+'</cbc:ID>'+(seller.bic?'<cac:FinancialInstitutionBranch><cbc:ID>'+xmlEsc(seller.bic)+'</cbc:ID></cac:FinancialInstitutionBranch>':'')+'</cac:PayeeFinancialAccount></cac:PaymentMeans>');
  L.push('  <cac:PaymentTerms><cbc:Note>'+xmlEsc("Communication structurée "+ogm)+'</cbc:Note></cac:PaymentTerms>');
  L.push('  <cac:TaxTotal><cbc:TaxAmount currencyID="EUR">'+f2(vat)+'</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="EUR">'+f2(net)+'</cbc:TaxableAmount><cbc:TaxAmount currencyID="EUR">'+f2(vat)+'</cbc:TaxAmount><cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>'+rate+'</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal>');
  L.push('  <cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="EUR">'+f2(net)+'</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="EUR">'+f2(net)+'</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="EUR">'+f2(gross)+'</cbc:TaxInclusiveAmount>'+(acompte>0?'<cbc:PrepaidAmount currencyID="EUR">'+f2(acompte)+'</cbc:PrepaidAmount>':'')+'<cbc:PayableAmount currencyID="EUR">'+f2(payable)+'</cbc:PayableAmount></cac:LegalMonetaryTotal>');
  L.push('  <cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="C62">1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="EUR">'+f2(net)+'</cbc:LineExtensionAmount><cac:InvoicePeriod><cbc:StartDate>'+svc+'</cbc:StartDate><cbc:EndDate>'+svc+'</cbc:EndDate></cac:InvoicePeriod><cac:Item><cbc:Name>'+xmlEsc(desc)+'</cbc:Name><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>'+rate+'</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="EUR">'+f2(net)+'</cbc:PriceAmount></cac:Price></cac:InvoiceLine>');
  L.push('</Invoice>');
  return L.join("\n");
}
const epcPayload=(seller,ogm,payable)=>["BCD","002","1","SCT",seller.bic||"",String(seller.name||"").slice(0,70),String(seller.iban||"").replace(/\s/g,""),"EUR"+f2(payable),"","",ogm].join("\n");


/* ───────────────── PRIMITIVES ───────────────── */
const lblS={fontSize:10.5,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",color:C.muted,fontFamily:FC};
const inpS={width:"100%",padding:"11px 12px",border:`1.5px solid ${C.border}`,borderRadius:10,background:"#fff",minHeight:46,fontFamily:FS};

function Field({label,value,onChange,placeholder,type="text",icon,hint,mono}){
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={sx(lblS,{display:"flex",justifyContent:"space-between"})}>{label}{hint&&<span style={{color:C.faint,fontWeight:600}}>{hint}</span>}</label>}
    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
      {icon&&<span style={{position:"absolute",left:12,color:C.faint,display:"flex",pointerEvents:"none"}}><Ic n={icon} sz={15}/></span>}
      <input type={type} value={value??""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={sx(inpS,{paddingLeft:icon?36:12,fontFamily:mono?FC:FS})}/>
    </div>
  </div>;
}
function Sel({label,value,onChange,opts}){
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={lblS}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={sx(inpS,{cursor:"pointer"})}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>;
}
function TA({label,value,onChange,placeholder}){
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={lblS}>{label}</label>}
    <textarea value={value??""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} rows={3} style={sx(inpS,{minHeight:80,resize:"vertical",lineHeight:1.5})}/>
  </div>;
}
function Switch({label,on,onToggle}){
  return <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"11px 13px",border:`1.5px solid ${on?C.blue:C.border}`,borderRadius:10,background:on?C.blueL:"#fff",cursor:"pointer",minHeight:46}}>
    <span style={{fontSize:13.5,fontWeight:on?600:500,color:on?C.blueDk:C.text}}>{label}</span>
    <span style={{position:"relative",width:40,height:23,flex:"0 0 auto"}}>
      <input type="checkbox" checked={on} onChange={onToggle} style={{position:"absolute",opacity:0,width:"100%",height:"100%",margin:0,cursor:"pointer"}}/>
      <span style={{position:"absolute",inset:0,borderRadius:12,background:on?C.blue:"#cfd8ea",transition:".15s"}}/>
      <span style={{position:"absolute",top:3,left:on?20:3,width:17,height:17,borderRadius:"50%",background:"#fff",transition:".15s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
    </span>
  </label>;
}
function Badge({c="slate",children}){
  const V={slate:{bg:"#F1F5F9",fg:"#475569",bd:"#CBD5E1"},blue:{bg:C.blueL,fg:"#1E40AF",bd:"#BFDBFE"},green:{bg:C.greenL,fg:"#065F46",bd:"#A7F3D0"},amber:{bg:C.amberL,fg:"#92400E",bd:"#FCD34D"},red:{bg:C.redL,fg:"#991B1B",bd:"#FECACA"},indigo:{bg:"#EEF2FF",fg:"#4338CA",bd:"#C7D2FE"}}[c]||{};
  return <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:6,border:`1px solid ${V.bd}`,background:V.bg,color:V.fg,fontSize:10.5,fontWeight:700,letterSpacing:".03em",fontFamily:FC,whiteSpace:"nowrap"}}>{children}</span>;
}
function Btn({children,onClick,v="blue",icon,full,sz="md",cls}){
  const V={blue:{bg:C.blue,fg:"#fff",bd:"transparent"},dark:{bg:C.navy,fg:"#fff",bd:"transparent"},sec:{bg:"#fff",fg:C.text,bd:C.border},green:{bg:C.green,fg:"#fff",bd:"transparent"},wa:{bg:"#22c55e",fg:"#fff",bd:"transparent"},danger:{bg:"#fff",fg:C.red,bd:"#FECACA"}}[v]||{};
  const S={md:{p:"11px 16px",fs:13.5,mh:46},sm:{p:"8px 13px",fs:12.5,mh:40}}[sz];
  return <button onClick={onClick} className={cls} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,width:full?"100%":undefined,padding:S.p,minHeight:S.mh,background:V.bg,color:V.fg,border:`1.5px solid ${V.bd}`,borderRadius:11,fontSize:S.fs,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>
    {icon&&<Ic n={icon} sz={S.fs} c={V.fg}/>}{children}
  </button>;
}
function Card({children,style,pad=14,cls}){
  return <div className={cls} style={sx({background:C.surf,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:"0 1px 3px rgba(15,23,42,.05)",padding:pad,overflow:"hidden"},style)}>{children}</div>;
}
function Sec({title,right}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
    <span style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:C.faint,fontFamily:FC}}>{title}</span>{right}
  </div>;
}
function KV({k,v,mono}){
  return <div style={{background:C.soft,borderRadius:9,padding:"8px 11px"}}>
    <div style={{fontSize:9,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.faint,fontFamily:FC,marginBottom:2}}>{k}</div>
    <div style={{fontSize:13,fontWeight:600,fontFamily:mono?FC:FS,wordBreak:"break-word"}}>{v||"—"}</div>
  </div>;
}

/* ───────────────── SIGNATURE PAD ───────────────── */
function SignaturePad({value,onChange}){
  const cref=useRef(null), ctxRef=useRef(null), wrap=useRef(null), drawing=useRef(false), prev=useRef(null);
  const [ink,setInk]=useState(!!value);
  const setup=()=>{
    const cv=cref.current,w=wrap.current; if(!cv||!w)return;
    const dpr=window.devicePixelRatio||1,width=w.clientWidth,height=160;
    cv.width=width*dpr; cv.height=height*dpr; cv.style.width=width+"px"; cv.style.height=height+"px";
    const ctx=cv.getContext("2d"); if(!ctx)return; ctx.scale(dpr,dpr); ctx.lineWidth=2.3; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle="#0F172A";
    ctxRef.current=ctx;
    if(value){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,width,height);img.src=value;setInk(true);}
  };
  useEffect(()=>{setup();const r=()=>setup();window.addEventListener("resize",r);return()=>window.removeEventListener("resize",r);},[]);
  const xy=e=>{const r=cref.current.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
  const down=e=>{e.preventDefault();drawing.current=true;setInk(true);prev.current=xy(e);try{cref.current.setPointerCapture(e.pointerId);}catch(x){}};
  const move=e=>{if(!drawing.current)return;const p=xy(e),ctx=ctxRef.current;ctx.beginPath();ctx.moveTo(prev.current.x,prev.current.y);ctx.lineTo(p.x,p.y);ctx.stroke();prev.current=p;};
  const upE=()=>{if(!drawing.current)return;drawing.current=false;onChange(cref.current.toDataURL("image/png"));};
  const clear=()=>{const cv=cref.current,ctx=ctxRef.current;if(ctx)ctx.clearRect(0,0,cv.width,cv.height);setInk(false);onChange("");};
  return <div>
    <div ref={wrap} style={{position:"relative"}}>
      <canvas ref={cref} onPointerDown={down} onPointerMove={move} onPointerUp={upE} onPointerLeave={upE}
        style={{width:"100%",height:160,border:`1.5px dashed ${C.border}`,borderRadius:12,background:"#fff",touchAction:"none",cursor:"crosshair"}}/>
      {!ink&&<span style={{position:"absolute",inset:0,display:"grid",placeItems:"center",pointerEvents:"none",color:C.faint,fontSize:13}}>Signez ici avec le doigt</span>}
    </div>
    <div style={{marginTop:8}}><Btn v="sec" sz="sm" icon="x" onClick={clear}>Effacer</Btn></div>
  </div>;
}

/* ───────────────── CHRONO (mini) ───────────────── */
const miniBtn=(bg)=>({flex:1,padding:"8px 12px",borderRadius:9,border:"none",background:bg,color:"#fff",fontWeight:700,fontSize:12.5,fontFamily:FS,cursor:"pointer"});
function ChronoMini({d,comp,crewRate,up}){
  const [now,setNow]=useState(Date.now());
  const running=!!d.chronoStart;
  useEffect(()=>{ if(!running) return; const id=setInterval(()=>setNow(Date.now()),1000); return ()=>clearInterval(id); },[running,d.chronoStart]);
  const acc=num(d.chronoAcc);
  const elapsedS=running?acc+Math.max(0,(now-d.chronoStart)/1000):acc;
  const hh=String(Math.floor(elapsedS/3600)).padStart(2,"0"), mm=String(Math.floor((elapsedS%3600)/60)).padStart(2,"0"), ss=String(Math.floor(elapsedS%60)).padStart(2,"0");
  const budgetH=num(d.heures), elapsedH=elapsedS/3600;
  const ratio=budgetH>0?elapsedH/budgetH*100:0;
  const over=budgetH>0&&elapsedH>budgetH;
  const liveMarge=comp.htva-(comp.couts-comp.mo+elapsedH*crewRate);
  return <div style={{border:`1.5px solid ${running?C.navy:C.border}`,borderRadius:11,padding:"11px 12px",background:running?C.navy:"#fff",color:running?"#fff":C.text}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:10,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",fontFamily:FC,color:running?"rgba(255,255,255,.55)":C.faint,display:"flex",alignItems:"center",gap:6}}><Ic n="clock" sz={12} c={running?"#93C5FD":C.muted}/>Chrono chantier</span>
      <span style={{fontFamily:FC,fontWeight:700,fontSize:20,letterSpacing:".02em"}}>{hh}:{mm}:<span style={{color:running?"#93C5FD":C.muted}}>{ss}</span></span>
    </div>
    {budgetH>0&&<div style={{marginTop:9}}>
      <div style={{height:5,borderRadius:4,background:running?"rgba(255,255,255,.15)":C.soft,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,ratio)}%`,background:over?"#ef4444":ratio>80?"#f59e0b":"#22c55e",transition:"width .9s linear"}}/></div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:10,fontFamily:FC,color:running?"rgba(255,255,255,.55)":C.faint}}><span>{ratio.toFixed(0)} % de {budgetH} h</span><span style={{color:liveMarge<=0?"#fca5a5":running?"#86efac":C.green}}>marge {eur(liveMarge)}</span></div>
    </div>}
    <div style={{display:"flex",gap:7,marginTop:10}}>
      {!running?<button onClick={()=>up({chronoStart:Date.now()})} style={miniBtn("#22c55e")}>{acc>0?"Reprendre":"Démarrer"}</button>:<button onClick={()=>up({chronoStart:null,chronoAcc:acc+(Date.now()-d.chronoStart)/1000})} style={miniBtn("#f59e0b")}>Pause</button>}
      {(acc>0||running)&&<button onClick={()=>up({chronoStart:null,chronoAcc:0})} style={{padding:"8px 14px",borderRadius:9,border:`1.5px solid ${running?"rgba(255,255,255,.25)":C.border}`,background:"transparent",color:running?"#fff":C.muted,fontWeight:700,fontSize:12.5,fontFamily:FS,cursor:"pointer"}}>Reset</button>}
    </div>
  </div>;
}

/* ───────────────── APP ───────────────── */
class ErrorBoundary extends Component{
  constructor(p){ super(p); this.state={err:false}; }
  static getDerivedStateFromError(){ return {err:true}; }
  componentDidCatch(e){ try{ console.error("Section error:", e&&e.message); }catch(_){} }
  render(){
    if(this.state.err){
      const reset=()=>{ this.setState({err:false}); if(this.props.onReset){try{this.props.onReset();}catch(_){}} };
      if(this.props.full) return <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:30,textAlign:"center",fontFamily:FS}}>
        <div style={{width:56,height:56,borderRadius:16,background:"#FEF2F2",display:"grid",placeItems:"center",fontSize:28}}>⚠️</div>
        <div style={{fontWeight:800,fontSize:18,color:C.navy}}>Un souci est survenu</div>
        <div style={{fontSize:13.5,color:C.muted,lineHeight:1.6,maxWidth:300}}>Tes données sont sauvegardées sur l'appareil. Reviens en lieu sûr pour continuer.</div>
        <button onClick={reset} style={{marginTop:6,padding:"12px 22px",borderRadius:12,border:"none",background:C.blue,color:"#fff",fontWeight:700,fontSize:14,fontFamily:FS,cursor:"pointer"}}>Revenir en lieu sûr</button>
      </div>;
      return <div style={{padding:16,margin:"8px 0",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:12,color:"#991B1B",fontSize:13,lineHeight:1.6}}>
        <div style={{fontWeight:700,marginBottom:4}}>Cette section a rencontré un souci.</div>
        <div>Tes données sont sauvegardées. Reviens en arrière, ou réessaie.</div>
        <button onClick={reset} style={{marginTop:10,padding:"8px 14px",borderRadius:9,border:"1px solid #FECACA",background:"#fff",color:"#991B1B",fontWeight:700,fontSize:12,cursor:"pointer"}}>Réessayer</button>
      </div>;
    }
    return this.props.children;
  }
}

export default function App({role}={}){
  // Verrou de rôle : un compte "terrain" ne peut jamais atteindre le mode
  // Bureau (salaires, marges). Le rôle vient de members.role via la coquille.
  const terrainOnly = role==="terrain";
  useFonts();
  const [view,setView]=useState("list");     // list | detail | agenda | equipe
  const [dossiers,setDossiers]=useState(SEED);
  const [team,setTeam]=useState(SEED_TEAM);
  const [trucks,setTrucks]=useState(SEED_TRUCKS);
  const [selId,setSelId]=useState(null);
  const [section,setSection]=useState("contact");
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const [room,setRoom]=useState("Salon");
  const [freeItem,setFreeItem]=useState("");
  const [toast,setToast]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [storageOK,setStorageOK]=useState(true);
  const [crm,setCrm]=useState({});
  const [crmClient,setCrmClient]=useState(null);
  const [crmFilter,setCrmFilter]=useState("all");
  const [crmSearch,setCrmSearch]=useState("");
  const [crmNote,setCrmNote]=useState("");
  const [clients,setClients]=useState([]);
  const [newClientOpen,setNewClientOpen]=useState(false);
  const [ncForm,setNcForm]=useState({nom:"",societe:"",tel:"",mail:"",tva:"",note:""});
  const [settings,setSettings]=useState(DEFAULT_SETTINGS);
  const [ident,setIdent]=useState(null);
  const [keyring,setKeyring]=useState({});
  const [groups,setGroups]=useState([]);
  const [msgs,setMsgs]=useState([]);
  const [decoded,setDecoded]=useState({});
  const [fps,setFps]=useState({});
  const [chatOpen,setChatOpen]=useState(false);
  const [chatCh,setChatCh]=useState("general");
  const [chatPane,setChatPane]=useState("thread");
  const [draft,setDraft]=useState("");
  const [chatBusy,setChatBusy]=useState(false);
  const [setupName,setSetupName]=useState("");
  const [grpName,setGrpName]=useState("");
  const [grpSel,setGrpSel]=useState([]);
  const syncRef=useRef(null);
  try{ const st=settings||{};
    if(st.company){ CO_NAME=st.company.name||CO_NAME; CO_BCE=st.company.bce||CO_BCE; CO_TVA=st.company.tvaNum||CO_TVA; CO_ADDR=st.company.addr||CO_ADDR; ME=st.company.email||ME; TEL=st.company.tel||TEL; IBAN=st.company.iban||IBAN; }
    if(st.margin){ TARGET={min:num(st.margin.min)||25,max:num(st.margin.max)||45}; }
    if(Array.isArray(st.rates)&&st.rates.length){ RATES=st.rates.map(r=>({w:num(r.w),h:num(r.h)})); }
    if(st.tva!=null&&st.tva!==""){ CFG_TVA=(num(st.tva)/100)||0.21; }
    if(st.lift!=null){ CFG_LIFT=num(st.lift); } if(st.prixKm!=null){ CFG_KM=num(st.prixKm); } if(st.depositPct!=null){ CFG_DEPOSIT=num(st.depositPct); }
    if(st.invoice&&st.invoice.prefix){ CFG_INVPREFIX=st.invoice.prefix; }
    if(st.peppol){ CFG_PEPPOL_ON=!!st.peppol.enabled; CFG_PEPPOL_ID=(st.peppol.scheme||"0208")+":"+(st.peppol.participant||""); }
    if(typeof st.cgv==="string"){ CGV_TEXT=st.cgv; }
  }catch(_){}
  const [calY,setCalY]=useState(new Date().getFullYear());
  const [calM,setCalM]=useState(new Date().getMonth());
  const [calDay,setCalDay]=useState(null);
  const [expM,setExpM]=useState(null);       // expanded team member id
  const [cFrom,setCFrom]=useState(""); const [cTo,setCTo]=useState("");
  const [eqTab,setEqTab]=useState("hommes");
  const [expTruck,setExpTruck]=useState(null);
  const [fieldMode,setFieldMode]=useState(false);
  const [appMode,setAppMode]=useState("launch");
  const [me,setMe]=useState(null);
  const [tScreen,setTScreen]=useState("jobs");
  const [tDraft,setTDraft]=useState({nom:"",tel:"",charge:"",decharge:"",date:"",note:""});
  const [terrainUser,setTerrainUser]=useState("");
  const [hScope,setHScope]=useState("all");
  const [hScale,setHScale]=useState("m");
  const [hAnchor,setHAnchor]=useState(todayStr());
  const headRef=useRef(null);
  const [headH,setHeadH]=useState(104);
  const saveT=useRef(null);

  const show=(m)=>{setToast(m);setTimeout(()=>setToast(null),2200);};
  const copy=(t,m)=>{try{navigator.clipboard.writeText(t);show(m||"Copié");}catch{show("Copié");}};
  const dlText=(name,txt,mime)=>{ try{ const b=new Blob([txt],{type:mime||"text/plain"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),1500); show("Téléchargé"); }catch(e){ try{navigator.clipboard.writeText(txt);}catch(_){ } show("Copié (téléchargement indisponible)"); } };

  // load
  useEffect(()=>{(async()=>{
    try{ if(window.storage){
      try{const r=await window.storage.get("roovers-dossiers"); if(r&&r.value){const a=JSON.parse(r.value); if(Array.isArray(a)&&a.length) setDossiers(a);}}catch(e){}
      try{const r=await window.storage.get("roovers-team"); if(r&&r.value){const a=JSON.parse(r.value); if(Array.isArray(a)&&a.length) setTeam(a);}}catch(e){}
      try{const r=await window.storage.get("roovers-trucks"); if(r&&r.value){const a=JSON.parse(r.value); if(Array.isArray(a)&&a.length) setTrucks(a);}}catch(e){}
      try{const r=await window.storage.get("roovers-crm"); if(r&&r.value){const o=JSON.parse(r.value); if(o&&typeof o==="object") setCrm(o);}}catch(e){}
      try{const r=await window.storage.get("roovers-clients"); if(r&&r.value){const a=JSON.parse(r.value); if(Array.isArray(a)) setClients(a);}}catch(e){}
      try{const r=await window.storage.get("roovers-settings"); if(r&&r.value){const o=JSON.parse(r.value); if(o&&typeof o==="object") setSettings(s=>({...s,...o,company:{...s.company,...(o.company||{})},peppol:{...s.peppol,...(o.peppol||{})},invoice:{...s.invoice,...(o.invoice||{})},margin:{...s.margin,...(o.margin||{})}}));}}catch(e){}
      try{const r=await window.storage.get("rmsg-me",false); if(r&&r.value){const o=JSON.parse(r.value); if(o&&o.deviceId) setIdent(o);}}catch(e){}
    } else setStorageOK(false); }catch(e){ setStorageOK(false); }
    setLoaded(true);
  })();},[]);
  // save
  useEffect(()=>{ if(!loaded) return; clearTimeout(saveT.current);
    saveT.current=setTimeout(async()=>{ try{ if(window.storage){ await window.storage.set("roovers-dossiers",JSON.stringify(dossiers),false); await window.storage.set("roovers-team",JSON.stringify(team),false); await window.storage.set("roovers-trucks",JSON.stringify(trucks),false); await window.storage.set("roovers-crm",JSON.stringify(crm),false); await window.storage.set("roovers-settings",JSON.stringify(settings),false); await window.storage.set("roovers-clients",JSON.stringify(clients),false);} }catch(e){ setStorageOK(false); } },700);
  },[dossiers,team,trucks,crm,settings,clients,loaded]);
  // measure header
  useEffect(()=>{ const m=()=>setHeadH(headRef.current?headRef.current.offsetHeight:104); m(); window.addEventListener("resize",m); return ()=>window.removeEventListener("resize",m); },[section,selId,view]);

  const d=dossiers.find(x=>x.id===selId);
  const comp=d?compute(d):null;
  const up=(patch)=>setDossiers(ds=>ds.map(x=>x.id===selId?{...x,...patch}:x));
  const f=(key)=>(val)=>up({[key]:val});
  const open=(id)=>{setSelId(id);setSection("contact");setView("detail");window.scrollTo(0,0);};
  const create=()=>{const nd=newDossier();setDossiers(ds=>[nd,...ds]);setSelId(nd.id);setSection("contact");setView("detail");window.scrollTo(0,0);show("Nouveau dossier");};
  const createTerrain=()=>{const mu=member(terrainUser); if(!mu||!mu.canQuote){show("Choisis ton nom (mode terrain) — accès devis requis");return;} const nd=newDossier({pending:true,createdByName:mu.nom}); setDossiers(ds=>[nd,...ds]); setSelId(nd.id); setSection("contact"); setView("detail"); window.scrollTo(0,0); show("Dossier créé — à valider par le bureau");};
  const confirmDossier=(id)=>{setDossiers(ds=>ds.map(x=>x.id===id?{...x,pending:false}:x)); show("Dossier confirmé");};
  const safeReset=()=>{ try{ setSelId(null); setSection("contact"); setView("list"); setCrmClient(null); setTScreen("jobs"); }catch(_){} };
  const chMembers=(ch)=> ch==="general"?Object.keys(keyring):((groups.find(g=>g.id===ch)||{}).members||[]);
  const msgSync=async()=>{
    if(!window.storage) return;
    try{
      const kk=await window.storage.list("rmsg-key-",true); const ring={};
      if(kk&&kk.keys) for(const key of kk.keys){ try{const r=await window.storage.get(key,true); if(r&&r.value){const o=JSON.parse(r.value); if(o&&o.id) ring[o.id]=o;}}catch(_){ } }
      if(JSON.stringify(ring)!==JSON.stringify(keyring)) setKeyring(ring);
      const gg=await window.storage.list("rmsg-group-",true); const grps=[];
      if(gg&&gg.keys) for(const key of gg.keys){ try{const r=await window.storage.get(key,true); if(r&&r.value){const o=JSON.parse(r.value); if(o&&o.id) grps.push(o);}}catch(_){ } }
      grps.sort((a,b)=>(a.ts||0)-(b.ts||0)); if(grps.length!==groups.length||JSON.stringify(grps)!==JSON.stringify(groups)) setGroups(grps);
      const mm=await window.storage.list("rmsg-m-",true); const arr=[];
      if(mm&&mm.keys) for(const key of mm.keys){ try{const r=await window.storage.get(key,true); if(r&&r.value){const o=JSON.parse(r.value); if(o&&o.id) arr.push(o);}}catch(_){ } }
      arr.sort((a,b)=>(a.ts||0)-(b.ts||0));
      const changedMsgs = arr.length!==msgs.length || (arr.length>0 && msgs.length>0 && arr[arr.length-1].id!==msgs[msgs.length-1].id);
      if(changedMsgs) setMsgs(arr);
      const fm={...fps}; let fch=false; for(const id of Object.keys(ring)){ if(!fm[id]){ fm[id]=await fingerprint(ring[id].ecdhPub); fch=true; } } if(fch) setFps(fm);
      if(ident){ const dec={...decoded}; let ch=false;
        for(const m of arr){ if(dec[m.id]) continue; const snd=ring[m.from];
          if(!snd){ dec[m.id]={text:null,err:true}; ch=true; continue; }
          try{ const res=await decryptFrom(m.env,ident.deviceId,ident.ecdhPriv,snd.ecdhPub,snd.ecdsaPub);
            dec[m.id]= res.ok?{text:res.text,verified:res.verified}:{text:null,locked:true}; ch=true;
          }catch(e){ dec[m.id]={text:null,err:true}; ch=true; } }
        if(ch) setDecoded(dec);
      }
    }catch(e){}
  };
  syncRef.current=msgSync;
  useEffect(()=>{ if(!FEATURES.messaging||!chatOpen) return; let alive=true; const run=()=>{ if(alive&&syncRef.current) syncRef.current(); }; run(); const t=setInterval(run,3500); return ()=>{alive=false;clearInterval(t);}; },[chatOpen]);
  const setupIdentity=async(name)=>{
    if(!cryptoOK()){ show("Chiffrement indisponible sur cet appareil"); return; }
    setChatBusy(true);
    try{ const kp=await genIdentity(); const deviceId=uid(); const meObj=Object.assign({deviceId,name:(name||"").trim()||"Moi"},kp);
      try{ await window.storage.set("rmsg-me",JSON.stringify(meObj),false); }catch(_){ }
      try{ await window.storage.set("rmsg-key-"+deviceId,JSON.stringify({id:deviceId,name:meObj.name,ecdhPub:kp.ecdhPub,ecdsaPub:kp.ecdsaPub,ts:Date.now()}),true); }catch(_){ }
      setIdent(meObj); await msgSync();
    }catch(e){ show("Erreur de génération des clés"); }
    setChatBusy(false);
  };
  const sendMsg=async()=>{
    const text=draft.trim(); if(!text||!ident) return;
    const ids=chMembers(chatCh); const recips=ids.map(i=>keyring[i]).filter(Boolean).map(k=>({id:k.id,ecdhPub:k.ecdhPub}));
    if(!recips.find(r=>r.id===ident.deviceId)) recips.push({id:ident.deviceId,ecdhPub:ident.ecdhPub});
    setChatBusy(true);
    try{ const env=await encryptFor(text,recips,ident); const mid=uid();
      const rec={id:mid,ch:chatCh,from:ident.deviceId,fromName:ident.name,ts:Date.now(),env};
      setDraft(""); setMsgs(m=>[...m,rec]); setDecoded(d=>Object.assign({},d,{[mid]:{text,verified:true}}));
      try{ await window.storage.set("rmsg-m-"+mid,JSON.stringify(rec),true); }catch(_){ show("Hors-ligne : non synchronisé"); }
    }catch(e){ show("Échec du chiffrement"); }
    setChatBusy(false);
  };
  const createGroup=async(name,sel)=>{
    if(!name.trim()||!ident) return; const gid=uid();
    const mem=Array.from(new Set([...(sel||[]),ident.deviceId]));
    const g={id:gid,name:name.trim(),members:mem,by:ident.deviceId,byName:ident.name,ts:Date.now()};
    setGroups(gr=>[...gr,g]); setChatCh(gid); setChatPane("thread");
    try{ await window.storage.set("rmsg-group-"+gid,JSON.stringify(g),true); }catch(_){ }
  };
  const del=(id)=>{setDossiers(ds=>ds.filter(x=>x.id!==id));setView("list");show("Dossier supprimé");};

  // team helpers
  const member=(id)=>team.find(m=>m.id===id);
  const onConge=(m,date)=>!!date&&(m.conges||[]).some(c=>c.from&&c.to&&date>=c.from&&date<=c.to);
  const conflictFor=(mid,dossId,date)=>!!date&&dossiers.some(o=>o.id!==dossId&&o.dateDem===date&&!o.archive&&(o.equipe||[]).includes(mid));
  const upMember=(id,patch)=>setTeam(t=>t.map(m=>m.id===id?{...m,...patch}:m));
  const upTruck=(id,patch)=>setTrucks(t=>t.map(v=>v.id===id?{...v,...patch}:v));
  const getEq=(m,k)=>(((m&&m.equip)||{})[k]||{etat:"bon",remplacer:false});
  const setEq=(mid,k,patch)=>{const m=member(mid);upMember(mid,{equip:{...((m&&m.equip)||{}),[k]:{...getEq(m,k),...patch}}});};
  const getDoc=(m,k)=>(((m&&m.docs)||{})[k]||{scan:false,ech:""});
  const setDoc=(mid,k,patch)=>{const m=member(mid);upMember(mid,{docs:{...((m&&m.docs)||{}),[k]:{...getDoc(m,k),...patch}}});};

  // inventory
  const addInv=(name)=>up({inventaire:[...d.inventaire,{id:uid(),name,room,qty:1}]});
  const qtyInv=(iid,dl)=>up({inventaire:d.inventaire.map(it=>it.id===iid?{...it,qty:Math.max(1,it.qty+dl)}:it)});
  const rmInv=(iid)=>up({inventaire:d.inventaire.filter(it=>it.id!==iid)});
  const setEmb=(k,sub,val)=>up({emballage:{...d.emballage,[k]:{...(d.emballage[k]||{e:0,u:0,r:0}),[sub]:num(val)}}});

  // adresses multiples
  const chDefault=()=>({id:uid(),addr:"",type:"maison",etage:"",asc:false,lift:false});
  const chList=(x)=>{ if(Array.isArray(x.charges)&&x.charges.length) return x.charges; if(x.adresseCharge) return [{id:"c0",addr:x.adresseCharge,type:x.chargeType||"maison",etage:x.chargeEtage||"",asc:!!x.chargeAsc,lift:!!x.chargeLift}]; return [chDefault()]; };
  const dchList=(x)=>{ if(Array.isArray(x.decharges)&&x.decharges.length) return x.decharges; if(x.adresseDecharge) return [{id:"d0",addr:x.adresseDecharge,type:x.dechargeType||"maison",etage:x.dechargeEtage||"",asc:!!x.dechargeAsc,lift:!!x.dechargeLift}]; return [chDefault()]; };
  const primCharge=(x)=>(chList(x)[0].addr)||"";
  const primDecharge=(x)=>(dchList(x)[0].addr)||"";
  const setCharges=(arr)=>up({charges:arr});
  const setDecharges=(arr)=>up({decharges:arr});
  const addCharge=()=>setCharges([...chList(d),chDefault()]);
  const addDecharge=()=>setDecharges([...dchList(d),chDefault()]);
  const upCharge=(id,patch)=>setCharges(chList(d).map(a=>a.id===id?{...a,...patch}:a));
  const upDecharge=(id,patch)=>setDecharges(dchList(d).map(a=>a.id===id?{...a,...patch}:a));
  const rmCharge=(id)=>{const a=chList(d).filter(x=>x.id!==id);setCharges(a.length?a:[chDefault()]);};
  const rmDecharge=(id)=>{const a=dchList(d).filter(x=>x.id!==id);setDecharges(a.length?a:[chDefault()]);};
  // camions du dossier
  const toggleTruck=(tid)=>{const cur=d.camions||[];up({camions:cur.includes(tid)?cur.filter(x=>x!==tid):[...cur,tid]});};
  const truckNames=(x)=>(x.camions||[]).map(id=>{const v=trucks.find(t=>t.id===id);return v?v.nom:null;}).filter(Boolean);
  /* ===== CRM : clients dérivés des dossiers ===== */
  const clientKeyOf=(mail,tel,nom)=>{const e=(mail||"").trim().toLowerCase();if(e)return"e:"+e;const t=(tel||"").replace(/\D/g,"");if(t)return"t:"+t;return"n:"+((nom||"").trim().toLowerCase()||"?");};
  const clientKey=(d)=>clientKeyOf(d.mail,d.tel,d.nom);
  const addClient=()=>{ const nom=(ncForm.nom||ncForm.societe||"").trim(); if(!nom){show("Indique au moins un nom ou une société");return;} const key=clientKeyOf(ncForm.mail,ncForm.tel,ncForm.nom||ncForm.societe); const rec={key,nom:ncForm.nom||ncForm.societe||"Client",societe:(ncForm.societe||"").trim(),tel:(ncForm.tel||"").trim(),mail:(ncForm.mail||"").trim(),tva:(ncForm.tva||"").trim(),note:(ncForm.note||"").trim(),recurrent:true,manual:true,ts:Date.now()}; setClients(cs=>[rec,...(cs||[]).filter(c=>c.key!==key)]); setNewClientOpen(false); setCrmClient(key); window.scrollTo(0,0); show("Client récurrent ajouté"); };
  const openNewClient=()=>{ setNcForm({nom:"",societe:"",tel:"",mail:"",tva:"",note:""}); setNewClientOpen(true); };
  const buildClients=()=>{const m={};(clients||[]).forEach(mc=>{const k=mc.key||clientKeyOf(mc.mail,mc.tel,mc.nom||mc.societe);m[k]={key:k,nom:mc.nom||mc.societe||"Sans nom",tel:mc.tel||"",mail:mc.mail||"",societe:mc.societe||"",tva:mc.tva||"",note:mc.note||"",dossiers:[],ca:0,statuses:{},firstDate:"",lastDate:"",manual:true,recurrent:!!mc.recurrent};});dossiers.filter(x=>!x.archive).forEach(d=>{const k=clientKey(d);if(!m[k])m[k]={key:k,nom:d.nom||"Sans nom",tel:d.tel||"",mail:d.mail||"",dossiers:[],ca:0,statuses:{},firstDate:"",lastDate:""};const c=m[k];if(d.nom)c.nom=d.nom;if(d.tel)c.tel=d.tel;if(d.mail)c.mail=d.mail;if(d.societe&&!c.societe)c.societe=d.societe;c.dossiers.push(d);c.statuses[d.statut]=(c.statuses[d.statut]||0)+1;if(["confirme","encours","effectue"].includes(d.statut))c.ca+=compute(d).tvac;if(d.dateDem){if(!c.firstDate||d.dateDem<c.firstDate)c.firstDate=d.dateDem;if(d.dateDem>c.lastDate)c.lastDate=d.dateDem;}});return Object.values(m);};
  const cPhase=(c)=>{const s=c.statuses||{};if((s.effectue||0)>=2||c.recurrent)return{k:"recurrent",l:"Récurrent",c:"green"};if(s.effectue)return{k:"client",l:"Client",c:"green"};if(s.confirme||s.encours)return{k:"actif",l:"Actif",c:"blue"};if(s.devis)return{k:"prospect",l:"Prospect",c:"slate"};return{k:"autre",l:"—",c:"slate"};};
  const cRelance=(c)=>(c.statuses.devis||0)>0&&!(c.statuses.confirme||c.statuses.encours);
  const STG={prospect:{l:"Prospect",c:"slate"},actif:{l:"Actif",c:"blue"},recurrent:{l:"Récurrent",c:"green"},perdu:{l:"Perdu",c:"red"}};
  const cStage=(c)=>{const ov=(crm[c.key]||{}).stage;if(ov&&ov!=="auto"&&STG[ov])return STG[ov];const p=cPhase(c);return{l:p.l,c:p.c};};
  const setCStage=(k,v)=>setCrm(o=>({...o,[k]:{...(o[k]||{}),stage:v}}));
  const addCNote=(k,t)=>{if(!t.trim())return;setCrm(o=>({...o,[k]:{...(o[k]||{}),notes:[{id:uid(),date:new Date().toISOString(),text:t.trim()},...((o[k]||{}).notes||[])]}}));setCrmNote("");show("Note ajoutée");};
  const newForClient=(c)=>{const nd=newDossier({nom:c.nom,tel:c.tel,mail:c.mail});setDossiers(ds=>[nd,...ds]);setSelId(nd.id);setSection("contact");setView("detail");window.scrollTo(0,0);show("Dossier créé pour "+c.nom);};
  const shortD=(s)=>{try{return new Date(s+"T00:00").toLocaleDateString("fr-BE");}catch{return s||"—";}};
  const truckCap=(x)=>(x.camions||[]).reduce((s,id)=>{const v=trucks.find(t=>t.id===id);return s+(v?num(v.vol):0);},0);
  // inventaire : volume + démontage
  const itVol=(it)=>(it.vol!=null&&it.vol!=="")?num(it.vol):getVol(it.name);
  const volInv=(iid,dl)=>up({inventaire:d.inventaire.map(it=>it.id===iid?{...it,vol:Math.max(0,Math.round((itVol(it)+dl)*100)/100)}:it)});
  const demontInv=(iid)=>up({inventaire:d.inventaire.map(it=>it.id===iid?{...it,demont:!it.demont}:it)});
  const demontAll=()=>{const all=d.inventaire.length>0&&d.inventaire.every(it=>it.demont);up({inventaire:d.inventaire.map(it=>({...it,demont:!all}))});};
  // main-d'oeuvre : lignes
  const moList=(x)=>{ if(Array.isArray(x.moLines)&&x.moLines.length) return x.moLines; return [{id:"m0",h:x.coutMOheures||"",taux:x.coutMOtaux||32}]; };
  const addMO=()=>up({moLines:[...moList(d),{id:uid(),h:"",taux:32}]});
  const upMO=(id,patch)=>up({moLines:moList(d).map(l=>l.id===id?{...l,...patch}:l)});
  const rmMO=(id)=>{const a=moList(d).filter(l=>l.id!==id);up({moLines:a.length?a:[{id:uid(),h:"",taux:32}]});};

  const teamMsg=(x)=>{
    const names=(x.equipe||[]).map(id=>{const m=member(id);return m?`${m.nom}${m.role==="Chef d'équipe"?" (chef)":""}`:null;}).filter(Boolean);
    const eq=names.length?`👷 Équipe : ${names.join(", ")}`:`👥 ${x.nbDem} déménageurs`;
    const cam=truckNames(x); const camLine=cam.length?`\n🚚 ${cam.join(", ")}`:"";
    const fmtA=(arr)=>arr.length?arr.map((a,i)=>arr.length>1?`  ${i+1}. ${a}`:a).join("\n"):"—";
    const ch=chList(x).map(a=>a.addr).filter(Boolean), dh=dchList(x).map(a=>a.addr).filter(Boolean);
    const inv=x.inventaire&&x.inventaire.length?`\n📦 Meubles :\n${x.inventaire.slice(0,6).map(it=>`  • ${it.qty}× ${it.name}${it.demont?" (démontage)":""}`).join("\n")}${x.inventaire.length>6?`\n  … +${x.inventaire.length-6} autres`:""}`:"";
    return `🚛 *DÉMÉNAGEMENTS ROOVERS*\n📅 ${fmtL(x.dateDem)} — ${x.heureDem}${camLine}\n${eq}\n\n📍 *Chargement :*\n${fmtA(ch)}\n\n🏠 *Déchargement :*\n${fmtA(dh)}${inv}${x.remarques?`\n\n📝 ${x.remarques}`:""}\n\n💳 Virement ${IBAN}\n🙏 Merci à toute l'équipe !\n— Raphaël ${TEL}`;
  };

  /* ===== LIST ===== */
  const listView=()=>{
    const list=dossiers.filter(x=>{
      if(filter==="archive") return x.archive;
      if(x.archive) return false;
      if(filter!=="all"&&x.statut!==filter)return false;
      if(search&&!`${x.nom} ${primCharge(x)} ${primDecharge(x)}`.toLowerCase().includes(search.toLowerCase()))return false;
      return true;
    });
    const caSigne=dossiers.filter(x=>!x.archive&&["confirme","encours","effectue"].includes(x.statut)).reduce((s,x)=>s+compute(x).tvac,0);
    return <div>
      <div style={{position:"sticky",top:0,zIndex:30,background:C.bg,padding:"16px 16px 10px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,display:"grid",placeItems:"center"}}><Ic n="truck" sz={19} c="#fff"/></div>
          <div><div style={{fontFamily:FC,fontWeight:700,fontSize:16,lineHeight:1}}>Roovers</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>Carnet de dossiers</div></div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
            <div style={{textAlign:"right"}}><div style={{fontFamily:FC,fontWeight:700,fontSize:14,color:C.green}}>{eur(caSigne)}</div><div style={{fontSize:9.5,color:C.faint,letterSpacing:".05em",textTransform:"uppercase"}}>CA signé</div></div>
            {FEATURES.messaging&&<button onClick={()=>setChatOpen(true)} aria-label="Messagerie chiffrée" style={{width:36,height:36,borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="lock" sz={15} c={C.blue}/></button>}
            <button onClick={()=>{setView("params");window.scrollTo(0,0);}} aria-label="Paramètres" style={{width:36,height:36,borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="wrench" sz={15} c={C.muted}/></button>
            <button onClick={()=>setAppMode("launch")} aria-label="Accueil" style={{display:"flex",alignItems:"center",gap:5,padding:"7px 10px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:FC,color:C.muted,flex:"0 0 auto"}}><Ic n="back" sz={13} c={C.muted}/>Accueil</button>
          </div>
        </div>
        <Field icon="search" value={search} onChange={setSearch} placeholder="Rechercher un client, une adresse…"/>
        <div className="nb" style={{display:"flex",gap:7,marginTop:10,overflowX:"auto",paddingBottom:2}}>
          {[["all","Tous"],["devis","Devis"],["confirme","Confirmés"],["encours","En cours"],["effectue","Effectués"],["archive","Archivés"]].map(([v2,l])=>(
            <button key={v2} onClick={()=>setFilter(v2)} style={{flex:"0 0 auto",padding:"6px 13px",borderRadius:20,border:`1.5px solid ${filter===v2?C.blue:C.border}`,background:filter===v2?C.blue:"#fff",color:filter===v2?"#fff":C.muted,fontSize:12,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:11}}>
        {list.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:C.faint}}><Ic n="folder" sz={40} c={C.border}/><p style={{marginTop:14,fontSize:13.5}}>Aucun dossier ici.</p></div>}
        {list.map(x=>{const cp=compute(x);const st=STATUTS[x.statut];return(
          <Card key={x.id} pad={14} style={{cursor:"pointer",animation:"rUp .25s ease",opacity:x.archive?.6:x.pending?.85:1,...(x.pending?{border:"1.5px dashed #C4B5FD",background:"#FAF8FF"}:{})}}>
            <div onClick={()=>open(x.id)}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:9}}>
                <div><div style={{fontFamily:FC,fontWeight:700,fontSize:15.5,lineHeight:1.15}}>{x.nom||"Sans nom"}</div>
                  <div style={{fontSize:11.5,color:C.faint,marginTop:3}}>{x.dateDem?fmtL(x.dateDem):"Date à définir"} · {(x.equipe||[]).length||x.nbDem} {(x.equipe||[]).length?"affectés":"dém."}</div></div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>{x.pending&&<Badge c="indigo">À valider</Badge>}<Badge c={x.archive?"slate":st.c}>{x.archive?"Archivé":st.l}</Badge></div>
              </div>
              <div style={{fontSize:11.5,color:C.muted,lineHeight:1.6,marginBottom:10}}>
                <div style={{display:"flex",gap:6}}><Ic n="truck" sz={13} c={C.faint}/>{primCharge(x)?primCharge(x).split(",")[0]:"—"}</div>
                <div style={{display:"flex",gap:6}}><Ic n="map" sz={13} c={C.faint}/>{primDecharge(x)?primDecharge(x).split(",")[0]:"—"}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                <div><div style={{fontSize:9,color:C.faint,letterSpacing:".05em",textTransform:"uppercase"}}>TVAC</div><div style={{fontFamily:FC,fontWeight:700,fontSize:15}}>{eur(cp.tvac)}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.faint,letterSpacing:".05em",textTransform:"uppercase"}}>Marge · {pct(cp.margePct)}</div><div style={{fontFamily:FC,fontWeight:700,fontSize:15,color:cp.zc}}>{eur(cp.marge)}</div></div>
              </div>
            </div>
          </Card>
        );})}
      </div>
    </div>;
  };

  /* ===== SECTIONS ===== */
  const SECTIONS=[["contact","Contact","user"],["releve","Relevé","box"],["devis","Devis","euro"],["offre","Offre","pen"],["chargement","Matériel","box"],["mail","Mail","mail"],["facture","Facture","receipt"]];

  const contactSec=()=>{
    const assigned=d.equipe||[];
    const charges=chList(d), decharges=dchList(d);
    const stops=[...charges.map(a=>a.addr),...decharges.map(a=>a.addr)].filter(Boolean);
    const pays=(d.equipe||[]).map(id=>num(member(id)?.paye)).filter(x=>x>0);
    const crewRate=pays.length?pays.reduce((s,x)=>s+x,0):(d.nbDem*32);
    const openMaps=()=>{ if(stops.length<2){show("Renseigne au moins 2 adresses");return;} const e=s=>encodeURIComponent(s); const way=stops.slice(1,-1).map(e).join("|"); window.open(`https://www.google.com/maps/dir/?api=1&origin=${e(stops[0])}&destination=${e(stops[stops.length-1])}${way?"&waypoints="+way:""}&travelmode=driving`,"_blank"); };
    const addrBlock=(a,i,kind,upFn,rmFn,arr)=>(
      <div key={a.id} style={{padding:11,border:`1.5px solid ${C.border}`,borderRadius:11,background:C.soft,display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:10.5,fontWeight:700,fontFamily:FC,color:C.muted,letterSpacing:".04em"}}>{kind}{arr.length>1?" #"+(i+1):""}</span>
          {arr.length>1&&<button onClick={()=>rmFn(a.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Ic n="x" sz={15} c={C.red}/></button>}
        </div>
        <Field label="Adresse" value={a.addr} onChange={v=>upFn(a.id,{addr:v})} icon={kind==="Chargement"?"truck":"map"} placeholder="Rue, n°, CP, ville"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Sel label="Type" value={a.type} onChange={v=>upFn(a.id,{type:v})} opts={[{v:"maison",l:"Maison"},{v:"appart",l:"Appartement"},{v:"bureau",l:"Bureau"},{v:"garde-meuble",l:"Garde-meuble"}]}/>
          <Field label="Étage" value={a.etage} onChange={v=>upFn(a.id,{etage:v})} placeholder="RDC / 2e"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Switch label="Ascenseur" on={a.asc} onToggle={()=>upFn(a.id,{asc:!a.asc})}/>
          <Switch label="Monte-meubles" on={a.lift} onToggle={()=>upFn(a.id,{lift:!a.lift})}/>
        </div>
      </div>
    );
    return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card><Sec title="Client"/>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <Field label="Nom" value={d.nom} onChange={f("nom")} placeholder="M./Mme Dupont"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Téléphone" value={d.tel} onChange={f("tel")} icon="phone" mono placeholder="04XX…"/>
            <Field label="Email" type="email" value={d.mail} onChange={f("mail")} icon="mail" placeholder="@"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Société" value={d.societe} onChange={f("societe")} placeholder="Optionnel"/>
            <Field label="TVA" value={d.tva} onChange={f("tva")} mono placeholder="BE 0…"/>
          </div>
          {FEATURES.peppol&&<><Switch label="Client professionnel — facture Peppol (B2B)" on={isB2B(d)} onToggle={()=>up({clientPro:!isB2B(d)})}/>
          {isB2B(d)&&<div style={{fontSize:10.5,fontFamily:FC,color:C.muted,background:C.soft,borderRadius:8,padding:"7px 10px"}}>Peppol destinataire : {peppolFromVat(d.tva)||"renseigne la TVA"}</div>}</>}
          {(d.tel||d.mail)&&<div style={{display:"flex",gap:9}}>
            {d.tel&&<a href={`tel:${d.tel}`} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px",background:C.greenL,border:`1px solid #A7F3D0`,borderRadius:11,textDecoration:"none",color:"#065F46",fontWeight:600,fontSize:13}}><Ic n="phone" sz={15} c="#065F46"/>Appeler</a>}
            {d.mail&&<a href={`mailto:${d.mail}`} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px",background:C.blueL,border:`1px solid #BFDBFE`,borderRadius:11,textDecoration:"none",color:"#1E40AF",fontWeight:600,fontSize:13}}><Ic n="mail" sz={15} c="#1E40AF"/>Email</a>}
          </div>}
        </div>
      </Card>

      <Card><Sec title="Adresses de chargement" right={<Badge c="slate">{charges.length}</Badge>}/>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {charges.map((a,i)=>addrBlock(a,i,"Chargement",upCharge,rmCharge,charges))}
          <Btn v="sec" full icon="plus" onClick={addCharge}>Ajouter un chargement</Btn>
        </div>
      </Card>

      <Card><Sec title="Adresses de déchargement" right={<Badge c="slate">{decharges.length}</Badge>}/>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {decharges.map((a,i)=>addrBlock(a,i,"Déchargement",upDecharge,rmDecharge,decharges))}
          <Btn v="sec" full icon="plus" onClick={addDecharge}>Ajouter un déchargement</Btn>
        </div>
      </Card>

      <Card><Sec title="Trajet"/>
        <button onClick={openMaps} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px",border:"none",borderRadius:11,background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,color:"#fff",fontWeight:600,fontSize:13.5,fontFamily:FS,cursor:"pointer",marginBottom:11}}>
          <Ic n="map" sz={16} c="#fff"/>Ouvrir l'itinéraire (Google Maps)</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11}}>
          <Field label="Km" type="number" value={d.km} onChange={f("km")} mono placeholder="0"/>
          <Field label="Durée" value={d.dureeTrajet} onChange={f("dureeTrajet")} placeholder="45 min"/>
          <Field label="Prix / km (€)" type="number" value={d.prixKm} onChange={f("prixKm")} mono placeholder="0,40"/>
        </div>
        <div style={{marginTop:11,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.soft,borderRadius:10}}>
          <span style={{fontSize:11.5,color:C.muted}}>Coût trajet ({num(d.km)||0} km × {eur2(d.prixKm||0)})</span>
          <span style={{fontFamily:FC,fontWeight:700,fontSize:14}}>{eur2(num(d.km)*num(d.prixKm))}</span>
        </div>
        <div style={{marginTop:9,fontSize:11,color:C.faint,lineHeight:1.5}}>Maps s'ouvre pour lire distance et durée — reporte-les ici. Le coût/km entre dans tes coûts réels ; les péages se saisissent dans le Devis.</div>
      </Card>

      <Card><Sec title="Planning"/>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Date déménagement" type="date" value={d.dateDem} onChange={f("dateDem")}/>
            <Field label="Heure arrivée" type="time" value={d.heureDem} onChange={f("heureDem")}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Date emballage" type="date" value={d.dateEmballage} onChange={f("dateEmballage")}/>
            <Field label="Heure départ emballage" type="time" value={d.heureEmballage} onChange={f("heureEmballage")}/>
          </div>
          <Sel label="Déménageurs prévus" value={String(d.nbDem)} onChange={v=>up({nbDem:+v})} opts={[2,3,4,5,6].map(n=>({v:String(n),l:n+" dém."}))}/>
          <div>
            <label style={lblS}>Camion(s)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:7}}>
              {trucks.map(v=>{const on=(d.camions||[]).includes(v.id);const urg=v.etatMeca==="urgent";return(
                <button key={v.id} onClick={()=>toggleTruck(v.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderRadius:20,border:`1.5px solid ${on?C.blue:urg?"#FCA5A5":C.border}`,background:on?C.blue:urg?C.redL:"#fff",color:on?"#fff":urg?"#991B1B":C.text,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>
                  {on&&<Ic n="check" sz={13} c="#fff"/>}<Ic n="truck" sz={13} c={on?"#fff":urg?"#991B1B":C.muted}/>{v.nom}{urg?" ⚠":""}
                </button>
              );})}
              {trucks.length===0&&<span style={{fontSize:12,color:C.faint}}>Aucun camion — ajoute-les dans l'onglet Équipe.</span>}
            </div>
          </div>
          <ChronoMini d={d} comp={comp} crewRate={crewRate} up={up}/>
        </div>
      </Card>

      <Card><Sec title="Équipe affectée" right={<Badge c={assigned.length>=d.nbDem?"green":assigned.length>0?"amber":"slate"}>{assigned.length}/{d.nbDem}</Badge>}/>
        {!d.dateDem&&<div style={{fontSize:11.5,color:C.amber,marginBottom:10,display:"flex",gap:6,alignItems:"center"}}><Ic n="alert" sz={14} c={C.amber}/>Renseigne la date pour détecter les indispos.</div>}
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {team.filter(m=>m.actif).map(m=>{
            const on=assigned.includes(m.id); const conge=onConge(m,d.dateDem); const conflict=!on&&conflictFor(m.id,d.id,d.dateDem);
            return <button key={m.id} onClick={()=>up({equipe:on?assigned.filter(x=>x!==m.id):[...assigned,m.id]})}
              style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderRadius:20,border:`1.5px solid ${on?C.blue:(conge||conflict)?"#FCA5A5":C.border}`,background:on?C.blue:(conge||conflict)?C.redL:"#fff",color:on?"#fff":(conge||conflict)?"#991B1B":C.text,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>
              {on&&<Ic n="check" sz={13} c="#fff"/>}{m.nom}
              {(conge||conflict)&&<span style={{fontSize:9.5,fontFamily:FC,opacity:.85}}>{conge?"congé":"pris"}</span>}
            </button>;
          })}
        </div>
        {assigned.length<d.nbDem&&<div style={{marginTop:11,padding:"8px 11px",background:C.amberL,border:"1px solid #FCD34D",borderRadius:9,fontSize:11.5,color:"#92400E"}}>Il manque {d.nbDem-assigned.length} personne(s) par rapport au prévu.</div>}
        {assigned.some(id=>onConge(member(id),d.dateDem))&&<div style={{marginTop:8,padding:"8px 11px",background:C.redL,border:"1px solid #FECACA",borderRadius:9,fontSize:11.5,color:"#991B1B",display:"flex",gap:6}}><Ic n="alert" sz={14} c="#991B1B"/>Un membre affecté est en congé ce jour-là.</div>}
      </Card>

      <Card><Sec title="Remarques"/><TA value={d.remarques} onChange={f("remarques")} placeholder="Piano, accès difficile, objets fragiles…"/></Card>
    </div>;
  };

  const releveSec=()=>{
    const totVol=d.inventaire.reduce((s,it)=>s+itVol(it)*it.qty,0);
    const totItems=d.inventaire.reduce((s,it)=>s+it.qty,0);
    const byRoom={}; d.inventaire.forEach(it=>{byRoom[it.room]=(byRoom[it.room]||0)+itVol(it)*it.qty;});
    return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card style={{background:`linear-gradient(135deg,${C.navy},#1e293b)`,border:"none",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontFamily:FC,fontWeight:700,fontSize:30,lineHeight:1,color:"#fff"}}>{totVol.toFixed(1)} <span style={{fontSize:15,color:"rgba(255,255,255,.5)"}}>m³</span></div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.45)",letterSpacing:".08em",textTransform:"uppercase",marginTop:3}}>Volume estimé</div></div>
          <div style={{display:"flex",gap:10}}>
            <div style={{textAlign:"center",background:"rgba(255,255,255,.08)",borderRadius:9,padding:"8px 12px"}}><div style={{fontFamily:FC,fontWeight:700,fontSize:17,color:"#93C5FD"}}>{totItems}</div><div style={{fontSize:8.5,color:"rgba(255,255,255,.4)",textTransform:"uppercase"}}>Articles</div></div>
            <div style={{textAlign:"center",background:"rgba(255,255,255,.08)",borderRadius:9,padding:"8px 12px"}}><div style={{fontFamily:FC,fontWeight:700,fontSize:17,color:"#93C5FD"}}>{(totVol/30).toFixed(1)}</div><div style={{fontSize:8.5,color:"rgba(255,255,255,.4)",textTransform:"uppercase"}}>Camions</div></div>
          </div>
        </div>
      </Card>
      {(d.camions||[]).length>0&&(()=>{const cap=truckCap(d);const fill=cap>0?totVol/cap*100:0;return(
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
            <span style={{fontSize:10.5,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.faint,fontFamily:FC}}>Capacité camions</span>
            <span style={{fontFamily:FC,fontWeight:700,fontSize:13}}>{totVol.toFixed(1)} / {cap} m³</span>
          </div>
          <div style={{height:8,borderRadius:5,background:C.soft,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,fill)}%`,background:fill>100?C.red:fill>85?C.amber:C.green,transition:"width .3s"}}/></div>
          <div style={{marginTop:6,display:"flex",justifyContent:"space-between",fontSize:10.5,fontFamily:FC,color:C.faint}}><span>{truckNames(d).join(", ")||"—"}</span><span style={{color:fill>100?C.red:C.muted}}>{fill>100?"surchargé":`${fill.toFixed(0)} % rempli`}</span></div>
        </Card>
      );})()}
      <Card><Sec title="Ajout rapide"/>
        <div className="nb" style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:6,marginBottom:11}}>
          {PIECES.map(p=><button key={p} onClick={()=>setRoom(p)} style={{flex:"0 0 auto",padding:"6px 13px",borderRadius:20,border:`1.5px solid ${room===p?C.navy:C.border}`,background:room===p?C.navy:"#fff",color:room===p?"#fff":C.muted,fontSize:12,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>{p}</button>)}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
          {(QUICK[room]||[]).map(a=><button key={a} onClick={()=>addInv(a)} style={{padding:"7px 11px",borderRadius:8,border:`1.5px solid ${C.border}`,background:"#fff",color:C.text,fontSize:12.5,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Ic n="plus" sz={12} c={C.blue}/>{a}</button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={freeItem} onChange={e=>setFreeItem(e.target.value)} placeholder="Autre meuble…" onKeyDown={e=>{if(e.key==="Enter"&&freeItem.trim()){addInv(freeItem.trim());setFreeItem("");}}} style={sx(inpS,{flex:1})}/>
          <Btn v="dark" icon="plus" onClick={()=>{if(freeItem.trim()){addInv(freeItem.trim());setFreeItem("");}}}>Ajouter</Btn>
        </div>
      </Card>
      <Card><Sec title={`Inventaire · ${totItems} article(s)`} right={d.inventaire.length>0?<button onClick={demontAll} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 9px",borderRadius:7,border:`1.5px solid ${C.border}`,background:"#fff",color:C.muted,fontSize:10.5,fontWeight:700,fontFamily:FC,cursor:"pointer"}}><Ic n="wrench" sz={12} c={C.muted}/>Tout démonter</button>:null}/>
        {d.inventaire.length===0&&<div style={{textAlign:"center",padding:"24px",color:C.faint,fontSize:13}}>Aucun article. Ajoutez via les boutons ci-dessus.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {d.inventaire.map(it=>(
            <div key={it.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",background:it.demont?C.blueL:C.soft,borderRadius:10,border:`1px solid ${it.demont?"#BFDBFE":"transparent"}`}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:600}}>{it.name}</div>
                <div style={{fontSize:10.5,color:C.faint,display:"flex",alignItems:"center",gap:6,marginTop:2}}>{it.room}
                  <span style={{display:"inline-flex",alignItems:"center",gap:2,background:"#fff",border:`1px solid ${C.border}`,borderRadius:6,padding:"1px 3px"}}>
                    <button onClick={()=>volInv(it.id,-0.1)} style={{border:"none",background:"none",cursor:"pointer",color:C.muted,fontWeight:700,fontSize:14,lineHeight:1,padding:"0 3px"}}>−</button>
                    <span style={{fontFamily:FC,fontWeight:600,fontSize:11,minWidth:52,textAlign:"center",color:C.text}}>{(itVol(it)*it.qty).toFixed(2)} m³</span>
                    <button onClick={()=>volInv(it.id,0.1)} style={{border:"none",background:"none",cursor:"pointer",color:C.muted,fontWeight:700,fontSize:14,lineHeight:1,padding:"0 3px"}}>+</button>
                  </span>
                </div>
              </div>
              <button onClick={()=>demontInv(it.id)} title="Démontage" style={{width:30,height:30,borderRadius:8,border:`1.5px solid ${it.demont?C.blue:C.border}`,background:it.demont?C.blue:"#fff",cursor:"pointer",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="wrench" sz={14} c={it.demont?"#fff":C.muted}/></button>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <button onClick={()=>qtyInv(it.id,-1)} style={qBtn}>−</button>
                <span style={{fontFamily:FC,fontWeight:700,fontSize:14,minWidth:18,textAlign:"center"}}>{it.qty}</span>
                <button onClick={()=>qtyInv(it.id,1)} style={qBtn}>+</button>
                <button onClick={()=>rmInv(it.id)} style={{...qBtn,border:"none",color:C.red,background:"transparent",width:28}}><Ic n="trash" sz={15} c={C.red}/></button>
              </div>
            </div>
          ))}
        </div>
        {Object.keys(byRoom).length>0&&<div style={{marginTop:13,paddingTop:12,borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:7}}>
          {Object.entries(byRoom).map(([r,v])=>{const mx=Math.max(...Object.values(byRoom));return(
            <div key={r} style={{display:"flex",alignItems:"center",gap:10,fontSize:11}}>
              <span style={{width:90,color:C.muted}}>{r}</span>
              <span style={{flex:1,height:6,background:C.soft,borderRadius:4,overflow:"hidden"}}><span style={{display:"block",height:"100%",width:`${v/mx*100}%`,background:`linear-gradient(90deg,${C.blue},${C.indigo})`,borderRadius:4}}/></span>
              <span style={{fontFamily:FC,fontWeight:600,color:C.muted,width:42,textAlign:"right"}}>{v.toFixed(1)}</span>
            </div>
          );})}
        </div>}
      </Card>
    </div>;
  };

  const devisSec=()=>{
    const nCam=(d.camions||[]).length;
    const recTitle = d.tarifMode==="forfait" ? "Forfait" : `Forfait horaire · ${d.nbDem} homme${d.nbDem>1?"s":""} · ${nCam||1} camion${(nCam||1)>1?"s":""}`;
    return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:9.5,letterSpacing:".08em",textTransform:"uppercase",color:C.faint,fontFamily:FC,fontWeight:700}}>Marge brute</div>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:3}}><span style={{fontFamily:FC,fontWeight:800,fontSize:24,color:comp.zc}}>{eur(comp.marge)}</span><span style={{fontFamily:FC,fontWeight:700,fontSize:14,color:comp.zc}}>{pct(comp.margePct)}</span></div></div>
          <Badge c={comp.zone==="cible"?"green":comp.zone==="haut"?"indigo":"red"}>{comp.zone==="cible"?"Dans la cible":comp.zone==="haut"?"Premium":"Sous la cible"}</Badge>
        </div>
        <div style={{position:"relative",height:6,borderRadius:4,background:C.soft,marginTop:10,overflow:"hidden"}}>
          {(()=>{const SC=70,cl=v=>Math.max(0,Math.min(100,v/SC*100));return<><div style={{position:"absolute",top:0,bottom:0,left:`${cl(TARGET.min)}%`,width:`${cl(TARGET.max)-cl(TARGET.min)}%`,background:"rgba(5,150,105,.18)"}}/><div style={{position:"absolute",top:0,bottom:0,left:0,width:`${cl(Math.max(0,comp.margePct))}%`,background:comp.zc,borderRadius:4}}/></>;})()}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11.5}}>
          <span style={{color:C.muted}}>HTVA <b style={{fontFamily:FC,color:C.text}}>{eur(comp.htva)}</b></span>
          <span style={{color:C.muted}}>Coûts <b style={{fontFamily:FC,color:C.red}}>−{eur(comp.couts)}</b></span>
        </div>
      </Card>

      <Card><Sec title={recTitle}/>
        <div style={{display:"flex",gap:5,background:C.soft,borderRadius:10,padding:4,marginBottom:13}}>
          {[["horaire","Tarif horaire"],["forfait","Forfait"]].map(([v2,l])=>(
            <button key={v2} onClick={()=>up({tarifMode:v2})} style={{flex:1,padding:"9px",borderRadius:7,border:"none",background:d.tarifMode===v2?"#fff":"transparent",color:d.tarifMode===v2?C.navy:C.muted,fontWeight:600,fontSize:12.5,fontFamily:FS,cursor:"pointer",boxShadow:d.tarifMode===v2?"0 1px 3px rgba(0,0,0,.1)":"none"}}>{l}</button>
          ))}
        </div>
        {d.tarifMode==="horaire"?<div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div><label style={lblS}>Barème (toucher pour appliquer)</label>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:6}}>
              {RATES.map(r=>{const on=num(d.prixHTVAh)===r.h;return(
                <button key={r.w} onClick={()=>up({prixHTVAh:r.h,nbDem:r.w})} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${on?C.blue:C.border}`,background:on?C.blueL:"#fff",cursor:"pointer"}}>
                  <Badge c={on?"blue":"slate"}>{r.w} dém. + camion</Badge>
                  <span style={{fontFamily:FC,fontWeight:700,fontSize:15,color:on?C.blueDk:C.text}}>{r.h} € <span style={{fontSize:10,color:C.faint,fontWeight:500}}>/h</span></span>
                </button>
              );})}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Heures facturées" type="number" value={d.heures} onChange={f("heures")} mono placeholder="6"/>
            <Sel label="Monte-meubles" value={String(d.optLift)} onChange={v=>up({optLift:+v})} opts={[{v:"0",l:"Non"},{v:String(CFG_LIFT),l:CFG_LIFT+" € / jour"}]}/>
          </div>
          <div style={{padding:12,background:C.soft,borderRadius:11}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={lblS}>Réduction</span>{num(d.reductionPct)>0&&<Badge c={d.reductionType==="degats"?"red":"amber"}>−{eur2(comp.remise)}</Badge>}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginTop:8}}>
              <Field label="% de réduction" type="number" value={d.reductionPct} onChange={f("reductionPct")} mono placeholder="0"/>
              <Sel label="Motif" value={d.reductionType||"promo"} onChange={f("reductionType")} opts={[{v:"promo",l:"Promotion"},{v:"degats",l:"Dégâts / geste"}]}/>
            </div>
          </div>
        </div>:<Field label="Prix forfait TVAC (€)" type="number" value={d.forfaitTVAC} onChange={f("forfaitTVAC")} mono placeholder="0,00"/>}
        <div style={{marginTop:13,paddingTop:12,borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:7}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5}}><span style={{color:C.muted}}>Total HTVA</span><span style={{fontFamily:FC,fontWeight:600}}>{eur2(comp.htva)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5}}><span style={{color:C.muted}}>TVA {Math.round(CFG_TVA*100)} %</span><span style={{fontFamily:FC,fontWeight:600}}>{eur2(comp.tva)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,paddingTop:6,borderTop:`1px dashed ${C.border}`}}><span>Total TVAC</span><span style={{fontFamily:FC,color:C.blue}}>{eur2(comp.tvac)}</span></div>
        </div>
      </Card>

      <Card><Sec title="Coûts réels — confidentiel"/>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={lblS}>Main-d'œuvre</label><span style={{fontSize:11,fontFamily:FC,color:C.muted}}>{eur2(comp.mo)}</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {moList(d).map((l,i)=>(
              <div key={l.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end"}}>
                <Field label={i===0?"Heures":undefined} type="number" value={l.h} onChange={v=>upMO(l.id,{h:v})} mono placeholder="6"/>
                <Field label={i===0?"Taux €/h":undefined} type="number" value={l.taux} onChange={v=>upMO(l.id,{taux:v})} mono placeholder="32"/>
                <button onClick={()=>rmMO(l.id)} style={{width:46,height:46,borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="x" sz={16} c={C.red}/></button>
              </div>
            ))}
            <Btn v="sec" sz="sm" icon="plus" onClick={addMO}>Ajouter une ligne d'heures</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Carburant (€)" type="number" value={d.coutCarburant} onChange={f("coutCarburant")} mono placeholder="0"/>
            <Field label="Matériel (€)" type="number" value={d.coutMateriel} onChange={f("coutMateriel")} mono placeholder="0"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Divers (€)" type="number" value={d.coutDivers} onChange={f("coutDivers")} mono placeholder="0"/>
            <Field label="Péages (€)" type="number" value={d.peages} onChange={f("peages")} mono placeholder="0" hint="du trajet"/>
          </div>
          {num(d.km)*num(d.prixKm)>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,color:C.muted,padding:"0 2px"}}><span>Coût trajet (km × prix/km)</span><span style={{fontFamily:FC}}>{eur2(comp.kmCost)}</span></div>}
        </div>
        <div style={{marginTop:13,paddingTop:12,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700}}>
          <span>Total coûts</span><span style={{fontFamily:FC,color:C.red}}>{eur2(comp.couts)}</span>
        </div>
      </Card>
    </div>
    );
  };

  const offreSec=()=>{
    const signed=!!d.signature&&!!d.signatureNom;
    const validate=()=>{ if(!d.signature){show("Fais signer le client d'abord");return;} if(!d.signatureNom){show("Indique le nom du signataire");return;} up({statut:"confirme",signatureDate:d.signatureDate||todayStr()}); show("Devis validé et signé"); };
    const printContract=()=>{ try{ window.print(); }catch(e){ show("Utilise le menu Imprimer de ton navigateur"); } };
    const eqNames=(d.equipe||[]).map(id=>member(id)?.nom).filter(Boolean);
    const charges=chList(d), decharges=dchList(d);
    const totVol=d.inventaire.reduce((s,it)=>s+itVol(it)*it.qty,0);
    const demontList=d.inventaire.filter(it=>it.demont);
    const liftAny=[...charges,...decharges].some(a=>a.lift);
    const cam=truckNames(d);
    const matLines=EMB.map(e=>{const v=d.emballage[e.k];const u=v?num(v.u):0;return u>0?{l:e.l,u}:null;}).filter(Boolean);
    const addrLine=(a)=>`${a.addr||"…"}${a.etage?` · étage ${a.etage}`:""}${a.asc?" · ascenseur":""}${a.lift?" · monte-meubles":""}`;
    return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card><Sec title="Statut du dossier"/>
        <Sel value={d.statut} onChange={f("statut")} opts={Object.entries(STATUTS).map(([v,o])=>({v,l:o.l}))}/>
      </Card>

      <Card cls="print-contract" pad={0}>
        <div style={{background:`linear-gradient(135deg,${C.navy},#1e3a5f)`,padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div><div style={{fontFamily:FC,color:"#fff",fontWeight:700,fontSize:17}}>Déménagements Roovers</div>
              <div style={{fontSize:10,color:"#93C5FD",letterSpacing:".12em",textTransform:"uppercase",marginTop:3}}>Offre / Contrat · {d.tarifMode==="horaire"?"tarif horaire":"forfait"}</div></div>
            <div style={{textAlign:"right",fontSize:9.5,color:"rgba(255,255,255,.6)",fontFamily:FC,lineHeight:1.6}}>BCE {CO_BCE}<br/>{TEL}</div>
          </div>
        </div>
        <div style={{padding:16,fontSize:12.5,lineHeight:1.7,color:C.text}}>
          <p style={{margin:"0 0 4px"}}>Madame, Monsieur <b>{d.nom||"…"}</b>,</p>
          <p style={{margin:"0 0 10px",color:C.muted,fontSize:12}}>Nous avons le plaisir de vous adresser notre offre détaillée pour votre déménagement.</p>

          <div style={{display:"flex",flexDirection:"column",gap:8,margin:"11px 0"}}>
            <div style={{background:C.soft,borderLeft:`3px solid ${C.blue}`,borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:C.muted,fontFamily:FC,marginBottom:4}}>Chargement</div>
              {charges.map((a,i)=><div key={a.id} style={{fontSize:12}}>{charges.length>1?`${i+1}. `:""}{addrLine(a)}</div>)}
            </div>
            <div style={{background:C.soft,borderLeft:`3px solid ${C.indigo}`,borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:C.muted,fontFamily:FC,marginBottom:4}}>Déchargement</div>
              {decharges.map((a,i)=><div key={a.id} style={{fontSize:12}}>{decharges.length>1?`${i+1}. `:""}{addrLine(a)}</div>)}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"11px 0"}}>
            <div style={{border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 10px"}}><div style={{fontSize:9.5,color:C.faint,textTransform:"uppercase",fontFamily:FC}}>Volume estimé</div><div style={{fontFamily:FC,fontWeight:700,fontSize:15}}>{totVol.toFixed(1)} m³</div></div>
            <div style={{border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 10px"}}><div style={{fontSize:9.5,color:C.faint,textTransform:"uppercase",fontFamily:FC}}>Équipe / camions</div><div style={{fontFamily:FC,fontWeight:700,fontSize:13}}>{d.nbDem} déménageurs{cam.length?` · ${cam.length} cam.`:""}</div></div>
          </div>

          <div style={{margin:"11px 0"}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:C.muted,fontFamily:FC,marginBottom:5}}>Prestations incluses</div>
            {["Mise à disposition de l'équipe et du matériel de manutention","Chargement, transport et déchargement","Démontage et remontage du mobilier standard"].map((p,i)=><div key={i} style={{display:"flex",gap:7,padding:"2px 0"}}><Ic n="check" sz={14} c={C.green}/>{p}</div>)}
            {liftAny&&<div style={{display:"flex",gap:7,padding:"2px 0"}}><Ic n="check" sz={14} c={C.green}/>Mise en œuvre d'un monte-meubles</div>}
            {matLines.length>0&&<div style={{display:"flex",gap:7,padding:"2px 0"}}><Ic n="check" sz={14} c={C.green}/>Fourniture du matériel d'emballage ({matLines.map(x=>`${x.u} ${x.l.toLowerCase()}`).join(", ")})</div>}
          </div>

          {demontList.length>0&&<div style={{margin:"11px 0",background:C.blueL,border:`1px solid #BFDBFE`,borderRadius:9,padding:"9px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"#1E40AF",fontFamily:FC,marginBottom:4}}>Démontage / remontage prévu</div>
            <div style={{fontSize:12,color:"#1E3A8A"}}>{demontList.map(it=>`${it.qty}× ${it.name}`).join(" · ")}</div>
          </div>}

          <div style={{background:C.navy,color:"#fff",borderRadius:10,padding:"13px 15px",textAlign:"center",margin:"12px 0"}}>
            {d.tarifMode==="horaire"?<>Pour <b>{d.heures||"…"} h</b> avec <b>{d.nbDem} déménageurs</b>{cam.length?<> et <b>{cam.length} camion{cam.length>1?"s":""}</b></>:null} :</>:"Prix forfaitaire :"}
            {num(d.reductionPct)>0&&<div style={{fontSize:11,color:"#fcd34d",marginTop:4}}>Réduction {d.reductionType==="degats"?"(geste commercial)":"(promotion)"} −{num(d.reductionPct)} % appliquée</div>}
            <div style={{fontFamily:FC,fontSize:19,fontWeight:700,color:"#93C5FD",marginTop:5}}>{eur2(comp.tvac)} TVAC</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:2}}>dont TVA {Math.round(CFG_TVA*100)} % : {eur2(comp.tva)}</div>
          </div>

          <div style={{fontSize:11.5,color:C.muted,lineHeight:1.6}}>
            <b>Planning.</b> {d.dateEmballage?`Emballage le ${fmtL(d.dateEmballage)} (départ ${d.heureEmballage||"—"}). `:""}Déménagement le {d.dateDem?fmtL(d.dateDem):"…"} — arrivée prévue {d.heureDem}. Kilométrage offert. Offre valable 10 jours ouvrables.
          </div>

          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:16}}>
            <div style={{fontSize:11,color:C.muted}}>Bon pour accord<br/><span style={{color:C.text,fontWeight:600}}>{d.signatureNom||"…"}</span><br/>{d.signatureDate?fmtL(d.signatureDate):"date…"}</div>
            <div style={{textAlign:"right"}}>
              {d.signature?<img src={d.signature} alt="signature" style={{height:64,maxWidth:170,objectFit:"contain"}}/>:<div style={{width:150,height:50,borderBottom:`1.5px solid ${C.border}`}}/>}
              <div style={{fontSize:9.5,color:C.faint,marginTop:2}}>Signature précédée de « lu et approuvé »</div>
            </div>
          </div>

          <div style={{marginTop:14,paddingTop:12,borderTop:`1px dashed ${C.border}`}}>
            <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:C.faint,fontFamily:FC,marginBottom:6}}>Conditions générales</div>
            <div style={{fontSize:9.5,color:C.muted,lineHeight:1.55}}>{(CGV_TEXT&&CGV_TEXT.trim()?CGV_TEXT.split("\n").filter(x=>x.trim()):CGV).map((t,i)=><p key={i} style={{margin:"0 0 5px"}}>{t}</p>)}</div>
            <div style={{marginTop:8,fontSize:9,color:C.faint,fontFamily:FC,lineHeight:1.6}}>{CO_NAME} · {CO_ADDR} · BCE/TVA {CO_TVA} · IBAN {IBAN} · {TEL} · {ME}</div>
          </div>
        </div>
      </Card>

      <Card cls="no-print"><Sec title="Signature client sur écran" right={signed?<Badge c="green">Validé</Badge>:null}/>
        <SignaturePad value={d.signature} onChange={v=>up({signature:v})}/>
        <div style={{marginTop:11}}><Field label="Nom du signataire" value={d.signatureNom} onChange={f("signatureNom")} placeholder="Prénom Nom"/></div>
        <div style={{marginTop:11,display:"flex",gap:9}}>
          <Btn v="green" full icon="check" onClick={validate}>Valider le devis</Btn>
        </div>
        {signed&&<div style={{marginTop:11,padding:"9px 12px",background:C.greenL,border:"1px solid #A7F3D0",borderRadius:10,fontSize:12,color:"#065F46",fontWeight:600,display:"flex",gap:7,alignItems:"center"}}><Ic n="check" sz={15} c="#065F46"/>Accepté le {fmtS(d.signatureDate||todayStr())} — signé {d.signatureNom}</div>}
      </Card>

      <div className="no-print" style={{display:"flex",gap:9}}>
        <Btn v="dark" full icon="print" onClick={printContract}>Imprimer / PDF</Btn>
        <Btn v="sec" icon="copy" onClick={()=>copy(`Déménagements Roovers — Offre\nClient : ${d.nom}\nChargement : ${charges.map(a=>a.addr).filter(Boolean).join(" | ")}\nDéchargement : ${decharges.map(a=>a.addr).filter(Boolean).join(" | ")}\nDate : ${fmtL(d.dateDem)} ${d.heureDem}\nVolume : ${totVol.toFixed(1)} m³\nÉquipe : ${eqNames.join(", ")||d.nbDem+" dém."}\nMontant : ${eur2(comp.tvac)} TVAC\n${TEL} · ${ME}`,"Offre copiée")}>Copier</Btn>
      </div>
      <div className="no-print" style={{fontSize:10.5,color:C.faint,textAlign:"center",lineHeight:1.5}}>« Imprimer » ouvre le dialogue du navigateur → choisis « Enregistrer en PDF ». Un PDF généré serveur viendra avec le backend.</div>
    </div>;
  };

  const chargementSec=()=>(
    <Card><Sec title="Matériel d'emballage (Enlevé / Utilisé / Repris)"/>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 46px 46px 46px",gap:8,fontSize:9,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",color:C.faint,fontFamily:FC,paddingBottom:4}}>
          <span>Désignation</span><span style={{textAlign:"center"}}>Enl.</span><span style={{textAlign:"center"}}>Util.</span><span style={{textAlign:"center"}}>Rep.</span>
        </div>
        {EMB.map(e=>(
          <div key={e.k} style={{display:"grid",gridTemplateColumns:"1fr 46px 46px 46px",gap:8,alignItems:"center"}}>
            <span style={{fontSize:13}}>{e.l}</span>
            {["e","u","r"].map(s=>(
              <input key={s} type="number" min={0} value={(d.emballage[e.k]&&d.emballage[e.k][s])||""} onChange={ev=>setEmb(e.k,s,ev.target.value)} placeholder="0" style={{width:"100%",padding:"9px 4px",border:`1.5px solid ${C.border}`,borderRadius:8,textAlign:"center",fontFamily:FC,fontSize:16}}/>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );

  const mailSec=()=>{
    const signed=!!d.signature&&!!d.signatureNom;
    const salut=d.nom?`Bonjour ${d.nom.split(" ").slice(-1)[0]},`:"Bonjour,";
    const ch=chList(d).map(a=>a.addr).filter(Boolean), dh=dchList(d).map(a=>a.addr).filter(Boolean);
    const chTxt=ch.length?ch.join(" | "):"…", dhTxt=dh.length?dh.join(" | "):"…";
    const body=`${salut}\n\nComme convenu, vous trouverez en pièce jointe votre offre de prix détaillée${signed?", revêtue de votre bon pour accord signé":""} pour votre déménagement :\n\nChargement : ${chTxt}\nDéchargement : ${dhTxt}\n\nMontant ${d.tarifMode==="horaire"?`pour ${d.heures||"…"} h avec ${d.nbDem} déménageurs`:"forfaitaire"} : ${eur2(comp.tvac)} TVAC (TVA 21 %).\nKilométrage offert. Offre valable 10 jours ouvrables.\n\nDate prévue : ${d.dateDem?fmtL(d.dateDem):"…"} — arrivée ${d.heureDem}.${d.dateEmballage?`\nEmballage : ${fmtL(d.dateEmballage)} (départ ${d.heureEmballage||"—"}).`:""}${d.remarques?`\n\nRemarques : ${d.remarques}`:""}\n\nBien à vous,\nRaphaël Van Cutsem\nDéménagements Roovers\n${TEL} · ${ME}`;
    const subject=`Offre de prix — Déménagements Roovers${d.nom?" — "+d.nom:""}`;
    return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card><Sec title="Pièces jointes"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`1.5px solid ${C.border}`,borderRadius:10}}>
            <Ic n="file" sz={18} c={C.blue}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:12.5,fontWeight:600}}>Offre de prix{signed?" — signée":""}</div><div style={{fontSize:10.5,color:C.faint}}>{signed?"Bon pour accord inclus":"À faire signer si besoin"}</div></div>
            {signed?<Badge c="green">Signée</Badge>:<Badge c="amber">Non signée</Badge>}
          </div>
          <Btn v="dark" full icon="print" onClick={()=>{setSection("offre");show("Imprime l'offre en PDF puis joins-la");}}>Préparer l'offre (PDF à joindre)</Btn>
          <div style={{fontSize:10.5,color:C.faint,lineHeight:1.5}}>Le client reçoit l'offre signée en pièce jointe. L'attachement automatique du PDF au mail se fera côté backend ; ici, génère le PDF dans l'onglet Offre puis glisse-le dans ton mail.</div>
        </div>
      </Card>
      <Card><Sec title="Email" right={<Switch label="Envoyé" on={d.mailEnvoye} onToggle={()=>up({mailEnvoye:!d.mailEnvoye,mailEnvoyeLe:!d.mailEnvoye?todayStr():""})}/>}/>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          <KV k="À" v={d.mail||"—"} mono/>
          <KV k="Objet" v={subject}/>
          <div style={{background:C.soft,borderRadius:10,padding:"12px 13px",fontSize:12.5,lineHeight:1.7,whiteSpace:"pre-line",maxHeight:300,overflowY:"auto"}}>{body}</div>
        </div>
        <div style={{display:"flex",gap:9,marginTop:12}}>
          <Btn v="sec" sz="sm" icon="copy" onClick={()=>copy(body,"Mail copié")}>Copier</Btn>
          <a href={`mailto:${d.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"8px",background:C.blueL,border:"1px solid #BFDBFE",borderRadius:11,textDecoration:"none",color:"#1E40AF",fontWeight:600,fontSize:12.5}}><Ic n="send" sz={14} c="#1E40AF"/>Ouvrir dans Mail</a>
        </div>
        {d.mailEnvoye&&<div style={{marginTop:10,padding:"7px 11px",background:C.greenL,border:"1px solid #A7F3D0",borderRadius:9,fontSize:11.5,color:"#065F46",fontWeight:600}}>Envoyé le {fmtS(d.mailEnvoyeLe)}</div>}
      </Card>
    </div>;
  };

  const factureSec=()=>{
    const b2b=isB2B(d);
    const seller={name:CO_NAME,bce:CO_BCE,vat:normVat(CO_TVA),addr:CO_ADDR,iban:IBAN,bic:(settings&&settings.company&&settings.company.bic)||"",contact:"Raphaël Van Cutsem",tel:TEL,email:ME};
    const ogm=ogmCom(ogmBase(d));
    const acompte=num(d.acompte);
    const payable=num(comp.tvac)-acompte;
    const route=(primCharge(d)||primDecharge(d))?((primCharge(d)||"?")+" → "+(primDecharge(d)||"?")):"";
    const desc="Déménagement"+(route?" — "+route:"")+(d.dateDem?" ("+d.dateDem+")":"");
    const buyerAddr=parseBEAddr(d.adresseFact||primDecharge(d)||"");
    const xml=buildUBL(d,comp,{seller,ogm,desc,buyerAddr});
    const epc=epcPayload(seller,ogm,payable);
    return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {FEATURES.peppol&&<Card>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:b2b?C.blueL:C.soft,display:"grid",placeItems:"center"}}><Ic n={b2b?"receipt":"mail"} sz={17} c={b2b?C.blue:C.muted}/></div>
            <div><div style={{fontWeight:700,fontSize:14}}>{b2b?"Facture électronique Peppol":"Facture PDF / e-mail"}</div><div style={{fontSize:11,color:C.faint}}>{b2b?"B2B · obligatoire · BIS Billing 3.0":"B2C · pas d'obligation Peppol"}</div></div>
          </div>
          <Badge c={b2b?"blue":"slate"}>{b2b?"UBL":"PDF"}</Badge>
        </div>
        <div style={{marginTop:11}}><Switch label="Client professionnel (assujetti TVA)" on={b2b} onToggle={()=>up({clientPro:!b2b})}/></div>
        {b2b&&<div style={{marginTop:9,fontSize:10.5,fontFamily:FC,color:C.muted,background:C.soft,borderRadius:8,padding:"8px 10px",lineHeight:1.6}}>Destinataire : {peppolFromVat(d.tva)||"— renseigne la TVA du client (onglet Contact)"}<br/>Émetteur : {CFG_PEPPOL_ID}</div>}
      </Card>}

      <Card><Sec title="Facture"/>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="N° facture" value={d.factureNum} onChange={f("factureNum")} mono placeholder={CFG_INVPREFIX+"-2026-001"}/>
            <Field label="Date" type="date" value={d.factureDate} onChange={f("factureDate")}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Acompte perçu (€)" type="number" value={d.acompte} onChange={f("acompte")} mono placeholder="0"/>
            <div style={{display:"flex",flexDirection:"column",gap:5}}><label style={lblS}>Net à payer</label><div style={{padding:"11px 12px",border:"1.5px solid "+C.border,borderRadius:10,background:C.soft,fontFamily:FC,fontWeight:700,minHeight:46,display:"flex",alignItems:"center"}}>{eur2(payable)}</div></div>
          </div>
          <Switch label="Facture payée" on={d.facturePayee} onToggle={()=>up({facturePayee:!d.facturePayee,facturePayeeLe:!d.facturePayee?todayStr():""})}/>
          {d.facturePayee&&<Field label="Payée le" type="date" value={d.facturePayeeLe} onChange={f("facturePayeeLe")}/>}
          <TA label="Remarques" value={d.factureNotes} onChange={f("factureNotes")}/>
        </div>
        <div style={{marginTop:12,padding:"10px 12px",background:d.facturePayee?C.greenL:C.amberL,border:"1px solid "+(d.facturePayee?"#A7F3D0":"#FCD34D"),borderRadius:10,fontSize:12.5,fontWeight:600,color:d.facturePayee?"#065F46":"#92400E"}}>
          {d.facturePayee?"Payée le "+fmtS(d.facturePayeeLe)+" · "+eur2(comp.tvac):"En attente · "+eur2(payable)+" à payer"}
        </div>
      </Card>

      <Card><Sec title="Communication structurée (OGM)"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <span style={{fontFamily:FC,fontWeight:800,fontSize:16,color:C.navy}}>{ogm}</span>
          <Btn v="sec" sz="sm" icon="copy" onClick={()=>copy(ogm,"Communication copiée")}>Copier</Btn>
        </div>
        <div style={{marginTop:8,fontSize:11,color:C.faint}}>Période de prestation : {d.dateDem?fmtL(d.dateDem):"—"} · à rappeler sur la facture et le virement</div>
      </Card>

      {FEATURES.peppol&&b2b&&<Card pad={0}>
        <div style={{padding:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}><Sec title="UBL · Peppol BIS Billing 3.0"/><Badge c="green">EN 16931</Badge></div>
        <pre style={{margin:0,padding:"0 14px 12px",fontFamily:FC,fontSize:9.5,lineHeight:1.55,whiteSpace:"pre-wrap",wordBreak:"break-word",color:C.text,maxHeight:280,overflow:"auto"}}>{xml}</pre>
        <div style={{padding:"0 14px 12px",display:"flex",gap:9}}>
          <Btn v="dark" sz="sm" icon="copy" onClick={()=>copy(xml,"XML UBL copié")}>Copier le XML</Btn>
          <Btn v="sec" sz="sm" icon="file" onClick={()=>dlText((d.factureNum||"facture")+".xml",xml,"application/xml")}>Télécharger</Btn>
        </div>
        <div style={{padding:"0 14px 14px",fontSize:10,color:C.faint,lineHeight:1.6}}>Le XML est le document légal. À transmettre via un Access Point Peppol certifié, puis conservé 10 ans. Validable sur peppolvalidator.com.</div>
      </Card>}

      <Card pad={0}>
        <div style={{padding:14}}><Sec title="Facture lisible"/></div>
        <pre style={{margin:0,padding:"0 14px 14px",fontFamily:FC,fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",color:C.text}}>{CO_NAME+"\nTél "+TEL+" · IBAN "+IBAN+" · "+normVat(CO_TVA)+"\n────────────────\nFACTURE N° "+(d.factureNum||CFG_INVPREFIX+"-2026-XXX")+"   "+(d.factureDate||todayStr())+"\n────────────────\nCLIENT : "+(d.societe||d.nom||"")+"\n"+(d.adresseFact||primDecharge(d)||"")+"\n"+(d.tva?"TVA : "+normVat(d.tva):"")+"\n────────────────\nDéménagement "+(d.dateDem?fmtL(d.dateDem):"")+"\n"+(primCharge(d)||"")+" → "+(primDecharge(d)||"")+"\n────────────────\nHTVA      "+eur2(comp.htva)+"\nTVA "+Math.round(CFG_TVA*100)+"%   "+eur2(comp.tva)+"\nTVAC      "+eur2(comp.tvac)+(acompte>0?"\nAcompte  −"+eur2(acompte)+"\nÀ PAYER   "+eur2(payable):"")+"\n────────────────\nVirement "+IBAN+"\nCommunication "+ogm}</pre>
        <div style={{padding:"0 14px 14px"}}><Btn v="sec" sz="sm" icon="copy" onClick={()=>copy("FACTURE "+(d.factureNum||"")+" — "+(d.societe||d.nom||"")+" — "+eur2(payable)+" à payer","Facture copiée")}>Copier le récapitulatif</Btn></div>
      </Card>

      <Card><Sec title="Paiement · QR SEPA (EPC)"/>
        <pre style={{margin:0,fontFamily:FC,fontSize:10.5,lineHeight:1.6,whiteSpace:"pre-wrap",color:C.muted,background:C.soft,borderRadius:9,padding:"10px 12px"}}>{epc}</pre>
        <div style={{marginTop:9,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <span style={{fontSize:10.5,color:C.faint,lineHeight:1.5}}>À encoder en QR sur le PDF — scannable par les apps bancaires belges.</span>
          <Btn v="sec" sz="sm" icon="copy" onClick={()=>copy(epc,"Données QR copiées")}>Copier</Btn>
        </div>
      </Card>
    </div>
    );
  };

  const detailView=()=>{
    const st=STATUTS[d.statut];
    return <div>
      <div ref={headRef} className="no-print" style={{position:"sticky",top:0,zIndex:40,background:C.surf,borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:11,padding:"11px 14px"}}>
          <button onClick={()=>setView("list")} style={{width:38,height:38,borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",display:"grid",placeItems:"center",cursor:"pointer",flex:"0 0 auto"}}><Ic n="back" sz={18}/></button>
          <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.nom||"Nouveau dossier"}</div>
            <div style={{fontSize:11,color:C.faint}}>{d.dateDem?fmtS(d.dateDem):"sans date"} · {eur(comp.tvac)}</div></div>
          <Badge c={st.c}>{st.l}</Badge>
        </div>
        <div className="nb" style={{display:"flex",gap:6,overflowX:"auto",padding:"0 12px 10px"}}>
          {SECTIONS.map(([id,l,ic])=>{const on=section===id;return(
            <button key={id} onClick={()=>setSection(id)} style={{flex:"0 0 auto",display:"flex",alignItems:"center",gap:6,padding:"8px 13px",borderRadius:9,border:"none",background:on?C.blue:C.soft,color:on?"#fff":C.muted,fontSize:12.5,fontWeight:on?600:500,fontFamily:FS,cursor:"pointer"}}><Ic n={ic} sz={14} c={on?"#fff":C.muted}/>{l}</button>
          );})}
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        {d.pending&&<div className="no-print" style={{marginBottom:14,padding:"11px 13px",background:"#F5F3FF",border:"1.5px dashed #C4B5FD",borderRadius:11,display:"flex",alignItems:"center",gap:10}}>
          <Ic n="clock" sz={18} c="#6D28D9"/>
          <div style={{flex:1,fontSize:12,color:"#5B21B6",lineHeight:1.5}}><b>Dossier créé au terrain{d.createdByName?` par ${d.createdByName}`:""}</b> — à valider par le bureau.</div>
          {!fieldMode&&<Btn v="dark" sz="sm" icon="check" onClick={()=>confirmDossier(d.id)}>Confirmer</Btn>}
        </div>}
        <ErrorBoundary>
        {section==="contact"&&contactSec()}
        {section==="releve"&&releveSec()}
        {section==="devis"&&devisSec()}
        {section==="offre"&&offreSec()}
        {section==="chargement"&&chargementSec()}
        {section==="mail"&&mailSec()}
        {section==="facture"&&factureSec()}
        </ErrorBoundary>
        <div className="no-print" style={{marginTop:16,display:"flex",gap:9}}>
          <Btn v="sec" full icon="archive" onClick={()=>{up({archive:!d.archive});show(d.archive?"Désarchivé":"Dossier archivé");}}>{d.archive?"Désarchiver":"Archiver"}</Btn>
          <Btn v="danger" icon="trash" onClick={()=>{if(confirm("Supprimer ce dossier ?"))del(d.id);}}>Supprimer</Btn>
        </div>
      </div>
    </div>;
  };

  /* ===== ÉQUIPE — hub RH + Flotte ===== */
  const activeMen=team.filter(m=>m.actif);
  const replaceReqs=team.flatMap(m=>EQUIP.flatMap(g=>g.items.filter(([k])=>getEq(m,k).remplacer).map(([k,l])=>({m,l}))));
  const docAlerts=team.flatMap(m=>DOCS.filter(dd=>{const dc=getDoc(m,dd.k);if(!dc.scan)return true;if(dd.ech&&dc.ech){const s=dStat(dc.ech);return s.c==="red"||s.c==="amber";}return false;}).map(dd=>{const dc=getDoc(m,dd.k);return{m,doc:dd,scan:dc.scan,st:dd.ech&&dc.ech?dStat(dc.ech):null};}));

  const SCALES=[["j","Jour"],["s","Semaine"],["m","Mois"],["a","Année"]];
  const periodWin=(scale,anchor)=>{ const d=new Date((anchor||todayStr())+"T00:00:00"); const iso=x=>x.toISOString().slice(0,10); let st,en,label;
    if(scale==="j"){ st=new Date(d); en=new Date(d); label=d.toLocaleDateString("fr-BE",{weekday:"long",day:"numeric",month:"long"}); }
    else if(scale==="s"){ const dow=(d.getDay()+6)%7; st=new Date(d); st.setDate(d.getDate()-dow); en=new Date(st); en.setDate(st.getDate()+6); label="Semaine du "+st.toLocaleDateString("fr-BE",{day:"numeric",month:"short"}); }
    else if(scale==="a"){ st=new Date(d.getFullYear(),0,1); en=new Date(d.getFullYear(),11,31); label="Année "+d.getFullYear(); }
    else { st=new Date(d.getFullYear(),d.getMonth(),1); en=new Date(d.getFullYear(),d.getMonth()+1,0); label=d.toLocaleDateString("fr-BE",{month:"long",year:"numeric"}); }
    return {start:iso(st),end:iso(en),label}; };
  const shiftPeriod=(scale,anchor,dir)=>{ const d=new Date((anchor||todayStr())+"T00:00:00"); if(scale==="j")d.setDate(d.getDate()+dir); else if(scale==="s")d.setDate(d.getDate()+7*dir); else if(scale==="a")d.setFullYear(d.getFullYear()+dir); else d.setMonth(d.getMonth()+dir); return d.toISOString().slice(0,10); };
  const hoursData=(scale,anchor)=>{ const {start,end,label}=periodWin(scale,anchor); const jl=dossiers.filter(x=>x.statut!=="annule"&&x.dateDem&&x.dateDem>=start&&x.dateDem<=end); const rows=activeMen.map(m=>{ let h=0,n=0; jl.forEach(x=>{ if((x.equipe||[]).includes(m.id)){ h+=num(x.heures); n++; } }); return {m,h,n,cost:h*num(m.paye)}; }); const total=rows.reduce((s,r)=>s+r.h,0); const avg=rows.length?total/rows.length:0; const max=Math.max(1,...rows.map(r=>r.h)); return {rows,total,avg,max,jobs:jl.length,jobsList:jl,label,start,end}; };

  const equipeView=()=>{
    const tdy=todayStr();
    const dispo=activeMen.filter(m=>!onConge(m,tdy));
    const absent=activeMen.filter(m=>onConge(m,tdy));
    const urgentTrucks=trucks.filter(v=>v.etatMeca==="urgent"||dStat(v.ctEch).c==="red");
    return <div>
      <div style={{position:"sticky",top:0,zIndex:30,background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"14px 16px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${C.indigo},#4f46e5)`,display:"grid",placeItems:"center"}}><Ic n="users" sz={19} c="#fff"/></div>
          <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:16,lineHeight:1}}>Ressources</div><div style={{fontSize:11,color:C.faint,marginTop:2}}>{activeMen.length} hommes · {trucks.length} camions</div></div>
          <button onClick={()=>setAppMode("launch")} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 11px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",fontSize:11.5,fontWeight:700,fontFamily:FC,color:C.muted,flex:"0 0 auto"}}>
            <Ic n="back" sz={14} c={C.muted}/>Accueil
          </button>
        </div>
        <div style={{display:"flex",gap:4,background:C.soft,padding:4,borderRadius:11}}>
          {[["hommes","Hommes","users"],["camions","Camions","truck"],["heures","Heures","clock"]].map(([v2,l,ic])=>{const on=eqTab===v2;return(
            <button key={v2} onClick={()=>setEqTab(v2)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px 4px",borderRadius:8,border:"none",background:on?C.surf:"transparent",boxShadow:on?"0 1px 3px rgba(15,23,42,.1)":"none",color:on?C.indigo:C.muted,fontSize:12.5,fontWeight:on?700:600,fontFamily:FS,cursor:"pointer"}}>
              <Ic n={ic} sz={14} c={on?C.indigo:C.muted}/>{l}
            </button>
          );})}
        </div>
      </div>
      {fieldMode&&<div style={{padding:"11px 16px 0"}}><div style={{padding:"10px 12px",background:C.amberL,border:"1px solid #FCD34D",borderRadius:10}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:11.5,color:"#92400E",lineHeight:1.5,marginBottom:9}}><Ic n="lock" sz={15} c="#92400E"/><span><b>Vue terrain</b> — ce que voient les hommes : matériel, camions, signalements. Salaires masqués. Le cloisonnement réel par compte se fait côté backend.</span></div>
        {(()=>{const qmen=team.filter(m=>m.actif&&m.canQuote);return qmen.length>0?(
          <div>
            <div style={{fontSize:10,fontWeight:700,fontFamily:FC,color:"#92400E",marginBottom:5,letterSpacing:".05em"}}>JE SUIS</div>
            <select value={terrainUser} onChange={e=>setTerrainUser(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"1.5px solid #FCD34D",background:"#fff",fontFamily:FS,fontSize:13,minHeight:42}}>
              <option value="">— choisis ton nom —</option>
              {qmen.map(m=><option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
            <div style={{marginTop:6,fontSize:10.5,color:"#92400E"}}>Autorisé aux devis : touche « + » pour créer un dossier ; il partira « à valider » au bureau.</div>
          </div>
        ):(<div style={{fontSize:11,color:"#92400E"}}>Aucun déménageur autorisé aux devis. Active « Peut créer des devis » sur une fiche.</div>);})()}
      </div></div>}
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
        {eqTab==="hommes"&&hommesSub(dispo,absent)}
        {eqTab==="camions"&&camionsSub(urgentTrucks)}
        {eqTab==="heures"&&heuresSub()}
      </div>
    </div>;
  };

  const hommesSub=(dispo,absent)=>(<>
    <Card><Sec title="Disponibilités aujourd'hui"/>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {dispo.map(m=><Badge key={m.id} c="green">{m.nom}</Badge>)}
        {absent.map(m=><Badge key={m.id} c="red">{m.nom} · congé</Badge>)}
        {dispo.length===0&&absent.length===0&&<span style={{fontSize:12.5,color:C.faint}}>Aucun membre actif.</span>}
      </div>
    </Card>
    {!fieldMode&&(replaceReqs.length>0||docAlerts.length>0)&&<Card style={{borderColor:"#FCD34D",background:C.amberL}}>
      <Sec title="À traiter"/>
      {replaceReqs.length>0&&<div style={{marginBottom:docAlerts.length?12:0}}>
        <div style={{fontSize:11,fontWeight:700,color:"#92400E",fontFamily:FC,marginBottom:6,display:"flex",alignItems:"center",gap:6}}><Ic n="wrench" sz={13} c="#92400E"/>Remplacements demandés ({replaceReqs.length})</div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>{replaceReqs.map((r,i)=><div key={i} style={{fontSize:12.5,color:"#7c2d12"}}>• <b>{r.m.nom}</b> — {r.l}</div>)}</div>
      </div>}
      {docAlerts.length>0&&<div>
        <div style={{fontSize:11,fontWeight:700,color:"#92400E",fontFamily:FC,marginBottom:6,display:"flex",alignItems:"center",gap:6}}><Ic n="file" sz={13} c="#92400E"/>Documents à régler ({docAlerts.length})</div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>{docAlerts.map((a,i)=><div key={i} style={{fontSize:12.5,color:"#7c2d12"}}>• <b>{a.m.nom}</b> — {a.doc.l} : {!a.scan?"non scanné":a.st?(a.st.c==="red"?"expiré":"expire dans "+a.st.d+" j"):""}</div>)}</div>
      </div>}
    </Card>}
    {team.map(m=>memberCard(m))}
    <Btn v="dark" full icon="plus" onClick={()=>{const nm={id:uid(),nom:"",role:"Déménageur",tel:"",actif:true,conges:[],paye:"",payeType:"Intérim",equip:{},docs:{}};setTeam(t=>[...t,nm]);setExpM(nm.id);setCFrom("");setCTo("");}}>Ajouter un homme</Btn>
  </>);

  const memberCard=(m)=>{
    const exp=expM===m.id;
    const reqCount=EQUIP.reduce((s,g)=>s+g.items.filter(([k])=>getEq(m,k).remplacer).length,0);
    return <Card key={m.id} style={{opacity:m.actif?1:.55}}>
      <div onClick={()=>{setExpM(exp?null:m.id);setCFrom("");setCTo("");}} style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
        <div style={{width:40,height:40,borderRadius:11,background:C.soft,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="user" sz={19} c={C.muted}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:14.5}}>{m.nom||"Sans nom"}</div>
          <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4,flexWrap:"wrap"}}><Badge c={ROLE_C[m.role]||"slate"}>{m.role}</Badge>{!fieldMode&&m.paye&&<span style={{fontSize:10.5,color:C.muted,fontFamily:FC}}>{eur2(m.paye)}/h</span>}{m.canQuote&&<Badge c="indigo">devis</Badge>}{reqCount>0&&<Badge c="red">{reqCount} à remplacer</Badge>}</div></div>
        <Ic n="chevR" sz={18} c={C.faint}/>
      </div>
      {exp&&<div style={{marginTop:13,paddingTop:13,borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:13}}>
        <Field label="Nom" value={m.nom} onChange={v=>upMember(m.id,{nom:v})} placeholder="Prénom Nom"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          <Sel label="Rôle" value={m.role} onChange={v=>upMember(m.id,{role:v})} opts={ROLES.map(r=>({v:r,l:r}))}/>
          <Field label="Téléphone" value={m.tel} onChange={v=>upMember(m.id,{tel:v})} mono icon="phone" placeholder="04XX…"/>
        </div>
        <Switch label="Actif (dispo pour affectation)" on={m.actif} onToggle={()=>upMember(m.id,{actif:!m.actif})}/>
        {!fieldMode&&<Switch label="Peut créer des devis (terrain)" on={!!m.canQuote} onToggle={()=>upMember(m.id,{canQuote:!m.canQuote})}/>}
        {!fieldMode&&<div style={{padding:12,background:C.soft,borderRadius:11}}>
          <div style={lblS}>Rémunération</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginTop:8}}>
            <Field label="Taux (€/h)" type="number" value={m.paye} onChange={v=>upMember(m.id,{paye:v})} mono placeholder="15"/>
            <Sel label="Contrat" value={m.payeType||"Intérim"} onChange={v=>upMember(m.id,{payeType:v})} opts={PAYE_TYPES.map(p=>({v:p,l:p}))}/>
          </div>
        </div>}
        <div>
          <label style={lblS}>Équipement</label>
          {EQUIP.map(g=>(
            <div key={g.g} style={{marginTop:9}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,color:C.muted,fontFamily:FC,marginBottom:6}}><Ic n={g.ic} sz={13} c={C.muted}/>{g.g}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {g.items.map(([k,l])=>{const e=getEq(m,k);const ec=ETATS.find(x=>x.v===e.etat)||ETATS[1];const eCol=ec.c==="red"?C.red:ec.c==="amber"?C.amber:ec.c==="green"?C.green:C.muted;return(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",background:e.remplacer?C.redL:"#fff",border:`1.5px solid ${e.remplacer?"#FECACA":C.border}`,borderRadius:9}}>
                    <span style={{flex:1,fontSize:12.5,fontWeight:600,color:C.text,minWidth:0}}>{l}</span>
                    <select value={e.etat} onChange={ev=>setEq(m.id,k,{etat:ev.target.value})} style={{fontFamily:FC,fontSize:11,fontWeight:700,padding:"5px 24px 5px 9px",borderRadius:7,border:`1.5px solid ${C.border}`,background:"#fff",color:eCol,minHeight:0,cursor:"pointer"}}>
                      {ETATS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                    <button onClick={()=>setEq(m.id,k,{remplacer:!e.remplacer})} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 8px",borderRadius:7,border:`1.5px solid ${e.remplacer?C.red:C.border}`,background:e.remplacer?C.red:"#fff",color:e.remplacer?"#fff":C.muted,fontSize:10.5,fontWeight:700,fontFamily:FC,cursor:"pointer",flex:"0 0 auto"}}>
                      <Ic n={e.remplacer?"check":"plus"} sz={12} c={e.remplacer?"#fff":C.muted}/>{e.remplacer?"Demandé":"Remplacer"}
                    </button>
                  </div>
                );})}
              </div>
            </div>
          ))}
        </div>
        <div>
          <label style={lblS}>Documents légaux & contrat</label>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:8}}>
            {DOCS.map(dd=>{const dc=getDoc(m,dd.k);const st=dd.ech&&dc.ech?dStat(dc.ech):null;return(
              <div key={dd.k} style={{padding:"9px 11px",border:`1.5px solid ${C.border}`,borderRadius:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Ic n="file" sz={15} c={dc.scan?C.green:C.faint}/>
                  <span style={{flex:1,fontSize:12.5,fontWeight:600,minWidth:0}}>{dd.l}</span>
                  {st&&<Badge c={st.c}>{st.l}</Badge>}
                  <button onClick={()=>setDoc(m.id,dd.k,{scan:!dc.scan})} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 9px",borderRadius:7,border:`1.5px solid ${dc.scan?C.green:C.border}`,background:dc.scan?C.greenL:"#fff",color:dc.scan?"#065F46":C.muted,fontSize:10.5,fontWeight:700,fontFamily:FC,cursor:"pointer",flex:"0 0 auto"}}>
                    <Ic n={dc.scan?"check":"plus"} sz={12} c={dc.scan?"#065F46":C.muted}/>{dc.scan?"Scanné":"Scanner"}
                  </button>
                </div>
                {dd.ech&&<div style={{marginTop:8}}><Field label="Échéance" type="date" value={dc.ech} onChange={v=>setDoc(m.id,dd.k,{ech:v})}/></div>}
              </div>
            );})}
          </div>
          <div style={{marginTop:7,fontSize:10.5,color:C.faint,lineHeight:1.5}}>« Scanner » note ici que le document existe et sa date. Le fichier image lui-même = stockage backend.</div>
        </div>
        <div>
          <label style={lblS}>Congés</label>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:7}}>
            {(m.conges||[]).map(cg=>(
              <div key={cg.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",background:C.redL,border:"1px solid #FECACA",borderRadius:9}}>
                <Ic n="cal" sz={14} c="#991B1B"/>
                <span style={{flex:1,fontSize:12,color:"#991B1B",fontWeight:600}}>{fmtS(cg.from)} → {fmtS(cg.to)}</span>
                <button onClick={()=>upMember(m.id,{conges:m.conges.filter(x=>x.id!==cg.id)})} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Ic n="x" sz={15} c="#991B1B"/></button>
              </div>
            ))}
            {(m.conges||[]).length===0&&<div style={{fontSize:12,color:C.faint}}>Aucun congé enregistré.</div>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,marginTop:9,alignItems:"end"}}>
            <Field label="Du" type="date" value={cFrom} onChange={setCFrom}/>
            <Field label="Au" type="date" value={cTo} onChange={setCTo}/>
            <Btn v="dark" icon="plus" onClick={()=>{if(!cFrom||!cTo){show("Choisis deux dates");return;}upMember(m.id,{conges:[...(m.conges||[]),{id:uid(),from:cFrom,to:cTo}]});setCFrom("");setCTo("");show("Congé ajouté");}}/>
          </div>
        </div>
        {!fieldMode&&<Btn v="danger" full icon="trash" onClick={()=>{if(confirm("Retirer cet homme ?")){setTeam(t=>t.filter(x=>x.id!==m.id));setExpM(null);show("Membre retiré");}}}>Retirer de l'équipe</Btn>}
      </div>}
    </Card>;
  };

  const camionsSub=(urgentTrucks)=>(<>
    {urgentTrucks.length>0&&<Card style={{borderColor:"#FECACA",background:C.redL}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}><Ic n="alert" sz={18} c={C.red}/><span style={{fontSize:13,fontWeight:700,color:"#991B1B"}}>Intervention nécessaire</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {urgentTrucks.map(v=>{const ctR=dStat(v.ctEch).c==="red";const u=v.etatMeca==="urgent";return <div key={v.id} style={{fontSize:12.5,color:"#7c2d12"}}>• <b>{v.nom}</b> — {u?"état mécanique urgent":""}{u&&ctR?" + ":""}{ctR?"CT expiré":""}</div>;})}
      </div>
    </Card>}
    {trucks.map(v=>truckCard(v))}
    {!fieldMode&&<Btn v="dark" full icon="plus" onClick={()=>{const nv={id:uid(),nom:"",type:"",immat:"",ctEch:"",assurEch:"",assurScan:false,etatMeca:"ok",etatNote:"",etatDate:""};setTrucks(t=>[...t,nv]);setExpTruck(nv.id);}}>Ajouter un camion</Btn>}
  </>);

  const truckCard=(v)=>{
    const exp=expTruck===v.id;
    const ct=dStat(v.ctEch), as=dStat(v.assurEch), mc=MECA[v.etatMeca]||MECA.ok;
    const mcBadge=mc.c==="green"?"green":mc.c==="amber"?"amber":"red";
    return <Card key={v.id} style={v.etatMeca==="urgent"?{borderColor:"#FECACA"}:undefined}>
      <div onClick={()=>setExpTruck(exp?null:v.id)} style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
        <div style={{width:42,height:42,borderRadius:11,background:v.etatMeca==="urgent"?C.redL:C.soft,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="truck" sz={21} c={v.etatMeca==="urgent"?C.red:C.muted}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:14.5}}>{v.nom||"Sans nom"}</div>
          <div style={{fontSize:11,color:C.faint,marginTop:1}}>{v.type||"—"}{v.vol?" · "+v.vol+" m³":""}{v.immat?" · "+v.immat:""}</div>
          <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
            <Badge c={mcBadge}>{mc.l}</Badge>
            <Badge c={ct.c}>CT · {ct.l}</Badge>
            <Badge c={as.c}>Assur. · {as.l}</Badge>
          </div>
        </div>
        <Ic n="chevR" sz={18} c={C.faint}/>
      </div>
      {exp&&<div style={{marginTop:13,paddingTop:13,borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:12}}>
        <Field label="Nom" value={v.nom} onChange={x=>upTruck(v.id,{nom:x})} placeholder="Ex. Sprinter 591"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
          <Field label="Type" value={v.type} onChange={x=>upTruck(v.id,{type:x})} placeholder="Fourgon"/>
          <Field label="Volume (m³)" type="number" value={v.vol} onChange={x=>upTruck(v.id,{vol:x})} mono placeholder="20"/>
        </div>
        <Field label="Immatriculation" value={v.immat} onChange={x=>upTruck(v.id,{immat:x})} mono placeholder="1-ABC-123"/>
        <div style={{padding:12,background:C.soft,borderRadius:11}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span style={lblS}>Contrôle technique</span><Badge c={ct.c}>{ct.l}</Badge></div>
          <Field label="Échéance CT" type="date" value={v.ctEch} onChange={x=>upTruck(v.id,{ctEch:x})}/>
        </div>
        <div style={{padding:12,background:C.soft,borderRadius:11}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span style={lblS}>Assurance</span><Badge c={as.c}>{as.l}</Badge></div>
          <Field label="Échéance assurance" type="date" value={v.assurEch} onChange={x=>upTruck(v.id,{assurEch:x})}/>
          <div style={{marginTop:9}}><Switch label="Attestation scannée" on={v.assurScan} onToggle={()=>upTruck(v.id,{assurScan:!v.assurScan})}/></div>
        </div>
        <div style={{padding:12,background:v.etatMeca==="urgent"?C.redL:v.etatMeca==="surveiller"?C.amberL:C.soft,borderRadius:11,border:v.etatMeca==="urgent"?"1px solid #FECACA":"none"}}>
          <div style={lblS}>État mécanique</div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            {Object.entries(MECA).map(([k,o])=>{const on=v.etatMeca===k;const col=o.c==="green"?C.green:o.c==="amber"?C.amber:C.red;return(
              <button key={k} onClick={()=>upTruck(v.id,{etatMeca:k,etatDate:(k!=="ok"&&!v.etatDate)?todayStr():v.etatDate})} style={{flex:1,padding:"9px 4px",borderRadius:9,border:`1.5px solid ${on?col:C.border}`,background:on?col:"#fff",color:on?"#fff":C.muted,fontSize:11.5,fontWeight:700,fontFamily:FC,cursor:"pointer"}}>{o.l}</button>
            );})}
          </div>
          {v.etatMeca!=="ok"&&<div style={{marginTop:10}}><TA label="Détail du problème" value={v.etatNote} onChange={x=>upTruck(v.id,{etatNote:x})} placeholder="Décris ce qui ne va pas…"/></div>}
          {v.etatMeca!=="ok"&&v.etatDate&&<div style={{marginTop:6,fontSize:10.5,color:C.faint}}>Signalé le {fmtS(v.etatDate)}</div>}
        </div>
        {!fieldMode&&<Btn v="danger" full icon="trash" onClick={()=>{if(confirm("Supprimer ce camion ?")){setTrucks(t=>t.filter(x=>x.id!==v.id));setExpTruck(null);show("Camion supprimé");}}}>Supprimer le camion</Btn>}
      </div>}
    </Card>;
  };

  const heuresSub=()=>{
    const {rows,total,avg,max,jobs,label}=hoursData(hScale,hAnchor);
    const sorted=[...rows].sort((a,b)=>b.h-a.h);
    const hmax=Math.max(0,...rows.map(r=>r.h)), hmin=rows.length?Math.min(...rows.map(r=>r.h)):0;
    const balanced=avg>0?(hmax<=avg*1.2&&hmin>=avg*0.8):true;
    const totalCost=rows.reduce((s,r)=>s+r.cost,0);
    const scopeL=label;
    return <>
      <div className="nb" style={{display:"flex",gap:7,overflowX:"auto"}}>
        {SCALES.map(([v2,l])=>{const on=hScale===v2;return <button key={v2} onClick={()=>setHScale(v2)} style={{flex:"0 0 auto",padding:"8px 16px",borderRadius:20,border:`1.5px solid ${on?C.indigo:C.border}`,background:on?C.indigo:"#fff",color:on?"#fff":C.muted,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>{l}</button>;})}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <button onClick={()=>setHAnchor(shiftPeriod(hScale,hAnchor,-1))} style={navArrow}><Ic n="back" sz={16}/></button>
        <div style={{fontFamily:FC,fontWeight:700,fontSize:13.5,textTransform:"capitalize",textAlign:"center",flex:1}}>{label}</div>
        <button onClick={()=>setHAnchor(shiftPeriod(hScale,hAnchor,1))} style={navArrow}><Ic n="chevR" sz={16}/></button>
      </div>
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,textAlign:"center"}}>
          <div><div style={{fontSize:22,fontWeight:800,fontFamily:FC,color:C.text}}>{total.toFixed(0)}</div><div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:".05em",fontFamily:FC}}>h · homme</div></div>
          <div><div style={{fontSize:22,fontWeight:800,fontFamily:FC,color:C.indigo}}>{avg.toFixed(1)}</div><div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:".05em",fontFamily:FC}}>moy / homme</div></div>
          <div><div style={{fontSize:22,fontWeight:800,fontFamily:FC,color:C.text}}>{jobs}</div><div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:".05em",fontFamily:FC}}>chantiers</div></div>
        </div>
        <div style={{marginTop:12,padding:"9px 12px",borderRadius:10,background:balanced?C.greenL:C.amberL,border:`1px solid ${balanced?"#A7F3D0":"#FCD34D"}`,display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,color:balanced?"#065F46":"#92400E"}}>
          <Ic n={balanced?"check":"alert"} sz={15} c={balanced?"#065F46":"#92400E"}/>{balanced?"Charge répartie équitablement (±20 %)":"Déséquilibre — certains hommes sortent de la bande ±20 %"}
        </div>
      </Card>
      <Card><Sec title="Heures par homme" right={<span style={{fontSize:10.5,color:C.faint,fontFamily:FC}}>vs moyenne</span>}/>
        {sorted.length===0&&<div style={{fontSize:12.5,color:C.faint,textAlign:"center",padding:"10px"}}>Aucun homme actif.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {sorted.map(r=>{const dev=avg>0?(r.h-avg)/avg*100:0;const within=Math.abs(dev)<=20;const barCol=within?C.green:dev>0?C.amber:C.indigo;const devLabel=avg>0?((dev>=0?"+":"")+dev.toFixed(0)+"%"):"—";return(
            <div key={r.m.id}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,fontWeight:700,fontFamily:FC}}>{r.m.nom}</span>
                <span style={{fontSize:12,fontFamily:FC}}><b>{r.h.toFixed(0)} h</b> <span style={{color:within?C.green:dev>0?C.amber:C.muted,fontWeight:700}}>{devLabel}</span></span>
              </div>
              <div style={{position:"relative",height:22,background:C.soft,borderRadius:7,overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,bottom:0,left:0,width:`${max>0?r.h/max*100:0}%`,background:barCol,borderRadius:7,transition:".3s"}}/>
                {avg>0&&max>0&&<div style={{position:"absolute",top:-1,bottom:-1,left:`${avg/max*100}%`,width:2,background:C.navy,opacity:.5}}/>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:10,color:C.faint,fontFamily:FC}}>
                <span>{r.n} chantier{r.n>1?"s":""}</span>
                {!fieldMode&&r.cost>0&&<span>≈ {eur(r.cost)} MO</span>}
              </div>
            </div>
          );})}
        </div>
        {avg>0&&<div style={{marginTop:12,fontSize:10.5,color:C.faint,display:"flex",alignItems:"center",gap:6}}><span style={{width:14,height:2,background:C.navy,opacity:.5,display:"inline-block"}}/>Trait = moyenne ({avg.toFixed(1)} h)</div>}
      </Card>
      {!fieldMode&&totalCost>0&&<Card><Sec title="Coût main-d'œuvre estimé"/><div style={{display:"flex",alignItems:"baseline",gap:8}}><span style={{fontSize:24,fontWeight:800,fontFamily:FC}}>{eur(totalCost)}</span><span style={{fontSize:12,color:C.faint}}>— {scopeL.toLowerCase()}</span></div><div style={{marginTop:6,fontSize:11,color:C.faint,lineHeight:1.5}}>Heures de chaque homme × son taux. Indicatif, basé sur les heures saisies dans les dossiers.</div></Card>}
      <div style={{fontSize:11,color:C.faint,lineHeight:1.6,padding:"0 2px"}}>Les heures viennent du champ « heures » de chaque dossier (durée chantier), compté pour chaque homme affecté. Renseigne-le dans l'onglet Devis pour affiner.</div>
    </>;
  };


  /* ===== AGENDA ===== */
  const agendaView=(filterId)=>{
    const passes=(x)=>!filterId||(x.equipe||[]).includes(filterId);
    const openMission=filterId?((id)=>{setSelId(id);setTScreen("job");window.scrollTo(0,0);}):open;
    const MO=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
    const DA=["Lu","Ma","Me","Je","Ve","Sa","Di"];
    const first=new Date(calY,calM,1).getDay(), off=(first===0?6:first-1);
    const ndays=new Date(calY,calM+1,0).getDate();
    const now=new Date();
    const moveDates={}; dossiers.forEach(x=>{if(x.dateDem&&!x.archive&&passes(x))moveDates[x.dateDem]=(moveDates[x.dateDem]||0)+1;});
    const pendingDates={}; dossiers.forEach(x=>{if(x.dateDem&&!x.archive&&x.pending&&passes(x))pendingDates[x.dateDem]=true;});
    const dayMoves=calDay?dossiers.filter(x=>x.dateDem===calDay&&!x.archive&&passes(x)):[];
    // conflicts that day
    const dayAssignCount={}; dayMoves.forEach(x=>(x.equipe||[]).forEach(id=>{dayAssignCount[id]=(dayAssignCount[id]||0)+1;}));
    return <div>
      <div style={{position:"sticky",top:0,zIndex:30,background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>{let m=calM-1,y=calY;if(m<0){m=11;y--;}setCalM(m);setCalY(y);}} style={navArrow}><Ic n="back" sz={18}/></button>
        <div style={{fontFamily:FC,fontWeight:700,fontSize:16}}>{MO[calM]} {calY}</div>
        <button onClick={()=>{let m=calM+1,y=calY;if(m>11){m=0;y++;}setCalM(m);setCalY(y);}} style={navArrow}><Ic n="chevR" sz={18}/></button>
      </div>
      <div style={{padding:"14px 16px"}}>
        <Card pad={12}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,textAlign:"center"}}>
            {DA.map(x=><div key={x} style={{fontSize:9.5,fontWeight:700,color:C.faint,padding:"4px 0",fontFamily:FC}}>{x}</div>)}
            {Array.from({length:off}).map((_,i)=><div key={"e"+i}/>)}
            {Array.from({length:ndays}).map((_,i)=>{const day=i+1;const ds=`${calY}-${String(calM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isToday=now.getFullYear()===calY&&now.getMonth()===calM&&now.getDate()===day;const sel=calDay===ds;const has=moveDates[ds];
              return <button key={day} onClick={()=>setCalDay(ds)} style={{position:"relative",aspectRatio:"1",borderRadius:9,border:sel?`2px solid ${C.blue}`:"1.5px solid transparent",background:isToday?C.blue:sel?C.blueL:"transparent",color:isToday?"#fff":C.text,fontSize:13.5,fontWeight:isToday||sel?700:500,fontFamily:FS,cursor:"pointer"}}>
                {day}{has&&<span style={{position:"absolute",bottom:5,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",background:isToday?"#fff":pendingDates[ds]?"#8B5CF6":C.amber}}/>}
              </button>;
            })}
          </div>
        </Card>
        <div style={{marginTop:14}}>
          {!calDay&&<div style={{textAlign:"center",padding:"30px",color:C.faint,fontSize:13}}><Ic n="cal" sz={36} c={C.border}/><p style={{marginTop:12}}>Touchez une date pour voir les déménagements.</p></div>}
          {calDay&&<>
            <div style={{fontFamily:FC,fontWeight:700,fontSize:14,marginBottom:12,textTransform:"capitalize"}}>{fmtL(calDay)}</div>
            {dayMoves.length===0&&<Card><div style={{textAlign:"center",padding:"14px",color:C.faint,fontSize:13}}>Aucun déménagement ce jour.</div></Card>}
            {dayMoves.map(x=>{
              const names=(x.equipe||[]).map(id=>{const m=member(id);return m?{nom:m.nom,conflict:dayAssignCount[id]>1}:null;}).filter(Boolean);
              return <Card key={x.id} style={{marginBottom:12,opacity:x.pending?.85:1,...(x.pending?{border:"1.5px dashed #C4B5FD",background:"#FAF8FF"}:{borderLeft:`4px solid ${STATUTS[x.statut].c==="green"?C.green:C.blue}`})}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div onClick={()=>openMission(x.id)} style={{flex:1,cursor:"pointer"}}>
                    <div style={{fontFamily:FC,fontWeight:700,fontSize:15}}>{x.nom}</div>
                    <div style={{fontSize:11.5,color:C.faint,marginTop:2}}>⏰ {x.heureDem} · 👥 {x.nbDem} prévus</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>{x.pending&&<Badge c="indigo">À valider</Badge>}<Badge c={STATUTS[x.statut].c}>{STATUTS[x.statut].l}</Badge></div>
                </div>
                <div style={{fontSize:11.5,color:C.muted,lineHeight:1.6,margin:"9px 0"}}>🚛 {primCharge(x)||"—"}<br/>🏠 {primDecharge(x)||"—"}</div>
                {/* équipe affectée + conflits */}
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                  {names.length===0&&<span style={{fontSize:11.5,color:C.amber,display:"flex",alignItems:"center",gap:5}}><Ic n="alert" sz={13} c={C.amber}/>Aucune équipe affectée</span>}
                  {names.map((nm,i)=><Badge key={i} c={nm.conflict?"red":"blue"}>{nm.nom}{nm.conflict?" · double":""}</Badge>)}
                </div>
                {truckNames(x).length>=0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:11}}>{truckNames(x).length===0&&<span style={{fontSize:11.5,color:C.amber,display:"flex",alignItems:"center",gap:5}}><Ic n="alert" sz={13} c={C.amber}/>Aucun camion affecté</span>}
                  {truckNames(x).map((tn,i)=><span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:6,border:`1px solid ${C.border}`,background:C.soft,color:C.muted,fontSize:10.5,fontWeight:700,fontFamily:FC}}><Ic n="truck" sz={12} c={C.muted}/>{tn}</span>)}
                </div>}
                {x.pending&&!fieldMode&&!filterId&&<button onClick={()=>confirmDossier(x.id)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"10px",border:"none",borderRadius:10,background:"#8B5CF6",color:"#fff",fontWeight:700,fontSize:12.5,fontFamily:FS,cursor:"pointer",marginBottom:11}}><Ic n="check" sz={15} c="#fff"/>Confirmer ce dossier</button>}
                {x.pending&&fieldMode&&<div style={{padding:"8px 11px",background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:9,fontSize:11.5,color:"#5B21B6",marginBottom:11,display:"flex",gap:6,alignItems:"center"}}><Ic n="clock" sz={13} c="#5B21B6"/>En attente de validation par le bureau.</div>}
                <div style={{background:`linear-gradient(135deg,${C.navy},#1e293b)`,borderRadius:10,padding:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.55)",textTransform:"uppercase",letterSpacing:".06em",fontFamily:FC,marginBottom:9}}>📱 Message équipe</div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>copy(teamMsg(x),"Message copié")} style={{flex:1,padding:"9px",background:"#fff",border:"none",borderRadius:8,color:C.navy,fontWeight:700,fontSize:12,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic n="copy" sz={14} c={C.navy}/>Copier</button>
                    <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(teamMsg(x))}`,"_blank")} style={{flex:1,padding:"9px",background:"#22c55e",border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:12,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic n="wa" sz={14} c="#fff"/>WhatsApp</button>
                  </div>
                </div>
              </Card>;
            })}
          </>}
        </div>
      </div>
    </div>;
  };

  /* ===== TERRAIN APP ===== */
  const TOAST = toast?<div className="no-print" style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:C.navy,color:"#fff",padding:"11px 18px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:FS,zIndex:99,display:"flex",alignItems:"center",gap:8,boxShadow:"0 14px 40px -10px rgba(0,0,0,.6)",animation:"rUp .25s ease"}}><Ic n="check" sz={15} c="#86efac"/>{toast}</div>:null;
  const meMember = me?member(me):null;
  const tStops=(x)=>[...chList(x).map(a=>a.addr),...dchList(x).map(a=>a.addr)].filter(Boolean);
  const openMapsX=(x)=>{ const s=tStops(x); if(s.length<2){show("Adresses incomplètes");return;} const e=v=>encodeURIComponent(v); const way=s.slice(1,-1).map(e).join("|"); window.open(`https://www.google.com/maps/dir/?api=1&origin=${e(s[0])}&destination=${e(s[s.length-1])}${way?"&waypoints="+way:""}&travelmode=driving`,"_blank"); };

  const terrainHeader=(title,sub)=>(
    <div style={{position:"sticky",top:0,zIndex:30,background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:11}}>
      <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,#8B5CF6,#6D28D9)`,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="truck" sz={18} c="#fff"/></div>
      <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:15,lineHeight:1.1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</div>{sub&&<div style={{fontSize:11,color:C.faint,marginTop:2}}>{sub}</div>}</div>
      {FEATURES.messaging&&<button onClick={()=>setChatOpen(true)} aria-label="Messagerie" style={{width:34,height:34,borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="lock" sz={15} c="#8B5CF6"/></button>}
      <button onClick={()=>{setMe(null);setSelId(null);setTScreen("jobs");setAppMode("launch");}} style={{padding:"7px 11px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:FC,color:C.muted,display:"flex",alignItems:"center",gap:5,flex:"0 0 auto"}}><Ic n="back" sz={13} c={C.muted}/>Quitter</button>
    </div>
  );

  const terrainLogin=()=>(
    <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:C.bg,borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,padding:"44px 22px"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:60,height:60,borderRadius:17,background:`linear-gradient(135deg,#8B5CF6,#6D28D9)`,display:"grid",placeItems:"center",margin:"0 auto 14px"}}><Ic n="truck" sz={30} c="#fff"/></div>
        <div style={{fontFamily:FC,fontWeight:800,fontSize:22}}>Roovers Terrain</div>
        <div style={{fontSize:13,color:C.faint,marginTop:4}}>Qui es-tu ?</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {team.filter(m=>m.actif).map(m=>(
          <button key={m.id} onClick={()=>{setMe(m.id);setTScreen("jobs");}} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 15px",borderRadius:14,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:42,height:42,borderRadius:12,background:C.soft,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="user" sz={21} c={C.muted}/></div>
            <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:15}}>{m.nom}</div><div style={{fontSize:11.5,color:C.faint}}>{m.role}</div></div>
            {m.canQuote&&<Badge c="indigo">devis</Badge>}
            <Ic n="chevR" sz={18} c={C.faint}/>
          </button>
        ))}
      </div>
      {!terrainOnly&&<button onClick={()=>setAppMode("launch")} style={{marginTop:22,padding:"12px",width:"100%",background:"none",border:"none",color:C.faint,fontSize:12.5,fontFamily:FS,cursor:"pointer"}}>← Retour à l'accueil</button>}
    </div>
  );

  const terrainJobs=()=>{
    const today=todayStr();
    const myJobs=dossiers.filter(x=>!x.archive && ((x.equipe||[]).includes(me) || (meMember && x.createdByName===meMember.nom))).sort((a,b)=>(a.dateDem||"9999").localeCompare(b.dateDem||"9999"));
    return <div>
      {terrainHeader("Mes chantiers", meMember?meMember.nom:"")}
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
        {myJobs.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:C.faint}}><Ic n="cal" sz={40} c={C.border}/><p style={{marginTop:14,fontSize:13.5}}>Aucun chantier prévu pour toi.</p></div>}
        {myJobs.map(x=>{const cam=truckNames(x);const isToday=x.dateDem===today;const mates=(x.equipe||[]).filter(id=>id!==me).map(id=>{const mm=member(id);return mm?mm.nom:null;}).filter(Boolean);return(
          <Card key={x.id} pad={14} style={{cursor:"pointer",...(x.pending?{border:"1.5px dashed #C4B5FD",background:"#FAF8FF"}:isToday?{borderLeft:`4px solid ${C.green}`}:undefined)}}>
            <div onClick={()=>{setSelId(x.id);setTScreen("job");window.scrollTo(0,0);}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
                <div style={{minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:15.5}}>{x.nom||"Client"}</div>
                  <div style={{fontSize:11.5,color:isToday?C.green:C.faint,marginTop:3,fontWeight:isToday?700:500}}>{isToday?"Aujourd'hui":x.dateDem?fmtL(x.dateDem):"Date à définir"} · {x.heureDem}</div></div>
                {x.pending?<Badge c="indigo">À valider</Badge>:<Badge c={STATUTS[x.statut].c}>{STATUTS[x.statut].l}</Badge>}
              </div>
              <div style={{fontSize:11.5,color:C.muted,lineHeight:1.6}}><div style={{display:"flex",gap:6}}><Ic n="truck" sz={13} c={C.faint}/>{primCharge(x)||"—"}</div><div style={{display:"flex",gap:6}}><Ic n="map" sz={13} c={C.faint}/>{primDecharge(x)||"—"}</div></div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:9}}>
                {cam.map((t,i)=><span key={"c"+i} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,background:C.soft,fontSize:10.5,fontWeight:700,fontFamily:FC,color:C.muted}}><Ic n="truck" sz={11} c={C.muted}/>{t}</span>)}
                {mates.map((nm,i)=><span key={"m"+i} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,background:C.blueL,fontSize:10.5,fontWeight:700,fontFamily:FC,color:C.blueDk}}><Ic n="user" sz={11} c={C.blueDk}/>{nm}</span>)}
              </div>
            </div>
          </Card>
        );})}
      </div>
    </div>;
  };

  const terrainJob=()=>{
    if(!d) return terrainJobs();
    const cam=truckNames(d); const mates=(d.equipe||[]).map(id=>{const mm=member(id);return mm?mm.nom:null;}).filter(Boolean);
    const pays=(d.equipe||[]).map(id=>num(member(id)?.paye)).filter(x=>x>0);
    const crewRate=pays.length?pays.reduce((s,x)=>s+x,0):(d.nbDem*32);
    const charges=chList(d), decharges=dchList(d);
    const demont=(d.inventaire||[]).filter(it=>it.demont);
    const addr=(a)=>`${a.addr||"—"}${a.etage?` · étage ${a.etage}`:""}${a.asc?" · asc.":""}${a.lift?" · monte-meubles":""}`;
    const inv=d.inventaire||[];
    const cartons=EMB.map(e=>{const v=d.emballage&&d.emballage[e.k];const q=v?num(v.e):0;return q>0?{l:e.l,q}:null;}).filter(Boolean);
    const acompteC=num(d.acompte), totalC=comp.tvac, netC=totalC-acompteC, forfaitC=d.tarifMode==="forfait";
    return <div>
      {terrainHeader(d.nom||"Chantier", d.dateDem?fmtL(d.dateDem)+" · "+d.heureDem:"")}
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:13}}>
        <button onClick={()=>{setSelId(null);setTScreen("jobs");}} style={{alignSelf:"flex-start",background:"none",border:"none",color:C.blue,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Ic n="back" sz={14} c={C.blue}/>Mes chantiers</button>
        {meMember&&<button onClick={()=>{setSection("devis");setTScreen("full");window.scrollTo(0,0);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",border:"none",borderRadius:13,background:"linear-gradient(135deg,#8B5CF6,#6D28D9)",color:"#fff",fontWeight:700,fontSize:13.5,fontFamily:FS,cursor:"pointer",boxShadow:"0 6px 16px -4px rgba(124,58,237,.45)"}}><Ic n="pen" sz={17} c="#fff"/>Devis complet · faire signer le client</button>}
        <ErrorBoundary>
          <ChronoMini d={d} comp={comp} crewRate={crewRate} up={up}/>
          <Card><Sec title="Adresses"/>
            {charges.map((a,i)=><div key={a.id} style={{marginBottom:8}}><div style={{fontSize:9.5,fontWeight:700,color:C.muted,fontFamily:FC,letterSpacing:".04em"}}>CHARGEMENT{charges.length>1?" "+(i+1):""}</div><div style={{fontSize:13,marginTop:1}}>{addr(a)}</div></div>)}
            {decharges.map((a,i)=><div key={a.id} style={{marginBottom:8}}><div style={{fontSize:9.5,fontWeight:700,color:C.muted,fontFamily:FC,letterSpacing:".04em"}}>DÉCHARGEMENT{decharges.length>1?" "+(i+1):""}</div><div style={{fontSize:13,marginTop:1}}>{addr(a)}</div></div>)}
            {tStops(d).length>=2&&<button onClick={()=>openMapsX(d)} style={{width:"100%",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"11px",border:"none",borderRadius:11,background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,color:"#fff",fontWeight:600,fontSize:13,fontFamily:FS,cursor:"pointer"}}><Ic n="map" sz={16} c="#fff"/>Itinéraire</button>}
          </Card>
          <Card><Sec title="Équipe & camions"/>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {mates.map((nm,i)=><Badge key={"m"+i} c="blue">{nm}</Badge>)}
              {cam.map((t,i)=><Badge key={"c"+i} c="slate">🚛 {t}</Badge>)}
              {mates.length===0&&cam.length===0&&<span style={{fontSize:12,color:C.faint}}>À confirmer par le bureau.</span>}
            </div>
          </Card>
          <Card><Sec title="Relevé du mobilier"/>
            {inv.length>0
              ? <div style={{display:"flex",flexDirection:"column",gap:5}}>{inv.map(it=><div key={it.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12.5}}><span style={{fontFamily:FC,fontWeight:700,color:C.blue,minWidth:26}}>{it.qty}×</span><span style={{flex:1}}>{it.name}</span>{it.room&&<span style={{fontSize:10.5,color:C.faint,fontFamily:FC}}>{it.room}</span>}</div>)}</div>
              : <div style={{fontSize:12,color:C.faint}}>Aucun meuble listé pour ce chantier.</div>}
          </Card>
          <Card><Sec title="Cartons & matériel à prévoir"/>
            {cartons.length>0
              ? <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{cartons.map((x,i)=><Badge key={i} c="blue">{x.q}× {x.l}</Badge>)}</div>
              : <div style={{fontSize:12,color:C.faint}}>À définir avec le bureau.</div>}
          </Card>
          <Card style={{background:C.blueL,border:"1.5px solid #BFDBFE"}}><Sec title="À encaisser auprès du client"/>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <Badge c={forfaitC?"blue":"amber"}>{forfaitC?"Forfait fixe":"À l'heure"}</Badge>
              {!forfaitC&&<span style={{fontSize:11.5,color:C.muted}}>{num(d.heures)||"?"}h × {eur(d.prixHTVAh)}/h</span>}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
              <span style={{fontSize:12,color:C.muted}}>Total TVAC</span>
              <span style={{fontFamily:FC,fontWeight:700,fontSize:15}}>{eur2(totalC)}</span>
            </div>
            {acompteC>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:4}}><span style={{fontSize:12,color:C.muted}}>Acompte déjà versé</span><span style={{fontFamily:FC,fontWeight:600,fontSize:13,color:C.green}}>−{eur2(acompteC)}</span></div>}
            <div style={{height:1,background:"#BFDBFE",margin:"9px 0"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
              <span style={{fontSize:12.5,fontWeight:700,color:C.navy}}>À demander aujourd'hui</span>
              <span style={{fontFamily:FC,fontWeight:800,fontSize:19,color:C.blue}}>{eur2(netC)}</span>
            </div>
          </Card>
          {demont.length>0&&<Card><Sec title="À démonter"/><div style={{fontSize:12.5,lineHeight:1.6}}>{demont.map(it=>`${it.qty}× ${it.name}`).join(" · ")}</div></Card>}
          {d.remarques&&<Card><Sec title="Remarques"/><div style={{fontSize:12.5,lineHeight:1.6}}>{d.remarques}</div></Card>}
          <Card><Sec title="Brief équipe"/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>copy(teamMsg(d),"Brief copié")} style={{flex:1,padding:"10px",background:C.soft,border:"none",borderRadius:9,color:C.navy,fontWeight:700,fontSize:12,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic n="copy" sz={14} c={C.navy}/>Copier</button>
              <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(teamMsg(d))}`,"_blank")} style={{flex:1,padding:"10px",background:"#22c55e",border:"none",borderRadius:9,color:"#fff",fontWeight:700,fontSize:12,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic n="wa" sz={14} c="#fff"/>WhatsApp</button>
            </div>
          </Card>
          {d.pending&&<div style={{padding:"10px 12px",background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:10,fontSize:11.5,color:"#5B21B6",display:"flex",gap:7,alignItems:"center"}}><Ic n="clock" sz={14} c="#5B21B6"/>En attente de validation par le bureau.</div>}
        </ErrorBoundary>
      </div>
    </div>;
  };

  const terrainMat=()=>{
    const m=meMember;
    return <div>
      {terrainHeader("Matériel", m?m.nom:"")}
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:13}}>
        {m&&<Card><Sec title="Mon équipement"/>
          {EQUIP.map(g=>(
            <div key={g.g} style={{marginTop:9}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,color:C.muted,fontFamily:FC,marginBottom:6}}><Ic n={g.ic} sz={13} c={C.muted}/>{g.g}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {g.items.map(([k,l])=>{const e=getEq(m,k);return(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:e.remplacer?C.redL:"#fff",border:`1.5px solid ${e.remplacer?"#FECACA":C.border}`,borderRadius:9}}>
                    <span style={{flex:1,fontSize:12.5,fontWeight:600}}>{l}</span>
                    <button onClick={()=>setEq(m.id,k,{remplacer:!e.remplacer})} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 9px",borderRadius:7,border:`1.5px solid ${e.remplacer?C.red:C.border}`,background:e.remplacer?C.red:"#fff",color:e.remplacer?"#fff":C.muted,fontSize:10.5,fontWeight:700,fontFamily:FC,cursor:"pointer"}}><Ic n={e.remplacer?"check":"wrench"} sz={12} c={e.remplacer?"#fff":C.muted}/>{e.remplacer?"Demandé":"À remplacer"}</button>
                  </div>
                );})}
              </div>
            </div>
          ))}
          <div style={{marginTop:9,fontSize:10.5,color:C.faint}}>Tes demandes remontent directement au bureau.</div>
        </Card>}
        <Card><Sec title="Camions — signaler un souci"/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {trucks.map(v=>{const mc=MECA[v.etatMeca]||MECA.ok;return(
              <div key={v.id} style={{padding:"10px 12px",border:`1.5px solid ${v.etatMeca==="urgent"?"#FECACA":C.border}`,borderRadius:10,background:v.etatMeca==="urgent"?C.redL:"#fff"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
                  <Ic n="truck" sz={17} c={v.etatMeca==="urgent"?C.red:C.muted}/>
                  <span style={{flex:1,fontFamily:FC,fontWeight:700,fontSize:13.5}}>{v.nom}{v.vol?` · ${v.vol} m³`:""}</span>
                  <Badge c={mc.c==="green"?"green":mc.c==="amber"?"amber":"red"}>{mc.l}</Badge>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {Object.entries(MECA).map(([k,o])=>{const on=v.etatMeca===k;const col=o.c==="green"?C.green:o.c==="amber"?C.amber:C.red;return(
                    <button key={k} onClick={()=>upTruck(v.id,{etatMeca:k,etatDate:(k!=="ok"&&!v.etatDate)?todayStr():v.etatDate})} style={{flex:1,padding:"7px 4px",borderRadius:8,border:`1.5px solid ${on?col:C.border}`,background:on?col:"#fff",color:on?"#fff":C.muted,fontSize:11,fontWeight:700,fontFamily:FC,cursor:"pointer"}}>{o.l}</button>
                  );})}
                </div>
                {v.etatMeca!=="ok"&&<div style={{marginTop:8}}><TA value={v.etatNote} onChange={x=>upTruck(v.id,{etatNote:x})} placeholder="Décris le souci…"/></div>}
              </div>
            );})}
          </div>
        </Card>
      </div>
    </div>;
  };

  const terrainNew=()=>{
    const can = meMember && meMember.canQuote;
    const submit=()=>{ if(!tDraft.nom){show("Indique au moins le nom du client");return;} const nd=newDossier({nom:tDraft.nom,tel:tDraft.tel,adresseCharge:tDraft.charge,adresseDecharge:tDraft.decharge,dateDem:tDraft.date,remarques:tDraft.note,pending:true,createdByName:meMember.nom,equipe:[me]}); setDossiers(ds=>[nd,...ds]); setTDraft({nom:"",tel:"",charge:"",decharge:"",date:"",note:""}); setSelId(nd.id); setTScreen("job"); window.scrollTo(0,0); show("Envoyé au bureau — à valider"); };
    return <div>
      {terrainHeader("Nouveau dossier","à valider par le bureau")}
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:13}}>
        {!can?<Card><div style={{padding:"12px",fontSize:13,color:C.muted,textAlign:"center",lineHeight:1.6}}>Tu n'es pas autorisé à créer des devis.<br/>Demande au bureau de t'activer.</div></Card>:<>
          <div style={{padding:"10px 12px",background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:10,fontSize:11.5,color:"#5B21B6",display:"flex",gap:7,alignItems:"flex-start"}}><Ic n="alert" sz={14} c="#5B21B6"/><span>Saisie rapide sur le terrain. Le bureau complétera le prix et confirmera.</span></div>
          <Card>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <Field label="Client" value={tDraft.nom} onChange={v=>setTDraft({...tDraft,nom:v})} placeholder="Nom du client"/>
              <Field label="Téléphone" value={tDraft.tel} onChange={v=>setTDraft({...tDraft,tel:v})} mono icon="phone" placeholder="04XX…"/>
              <Field label="Chargement" value={tDraft.charge} onChange={v=>setTDraft({...tDraft,charge:v})} icon="truck" placeholder="Adresse de départ"/>
              <Field label="Déchargement" value={tDraft.decharge} onChange={v=>setTDraft({...tDraft,decharge:v})} icon="map" placeholder="Adresse d'arrivée"/>
              <Field label="Date souhaitée" type="date" value={tDraft.date} onChange={v=>setTDraft({...tDraft,date:v})}/>
              <TA label="Notes (volume, accès, meubles lourds…)" value={tDraft.note} onChange={v=>setTDraft({...tDraft,note:v})} placeholder="Ce que tu as vu sur place…"/>
              <Btn v="blue" full icon="send" onClick={submit}>Envoyer au bureau</Btn>
            </div>
          </Card>
        </>}
      </div>
    </div>;
  };

  const terrainNav=(
    <div className="no-print" style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,zIndex:50,background:C.surf,borderTop:`1px solid ${C.border}`,display:"flex",padding:"7px 6px 10px",boxShadow:"0 -4px 20px rgba(15,23,42,.06)"}}>
      {[["jobs","Chantiers","folder"],["agenda","Agenda","cal"],["hours","Heures","clock"],["mat","Matériel","wrench"]].map(([v2,l,ic])=>{const on=(v2==="jobs"&&(tScreen==="jobs"||tScreen==="job"))||tScreen===v2;return(
        <button key={v2} onClick={()=>{setTScreen(v2);if(v2==="jobs")setSelId(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 2px",background:"none",border:"none",cursor:"pointer",color:on?C.blue:C.faint}}><Ic n={ic} sz={21} c={on?C.blue:C.faint}/><span style={{fontSize:10,fontWeight:on?700:500,fontFamily:FS}}>{l}</span></button>
      );})}
      {meMember&&meMember.canQuote&&<button onClick={()=>{setTScreen("newd");setSelId(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 2px",background:"none",border:"none",cursor:"pointer",color:tScreen==="newd"?"#7C3AED":C.blue}}>
        <span style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#8B5CF6,#6D28D9)",display:"grid",placeItems:"center",boxShadow:"0 4px 12px -2px rgba(124,58,237,.5)"}}><Ic n="plus" sz={19} c="#fff"/></span>
        <span style={{fontSize:10,fontWeight:600,fontFamily:FS}}>Devis</span>
      </button>}
    </div>
  );

  const terrainFull=()=>{
    if(!d) return terrainJobs();
    return <div>
      {terrainHeader(d.nom||"Devis","Processus complet · signature sur place")}
      <div style={{padding:"12px 16px 0"}}>
        <button onClick={()=>{setTScreen("job");window.scrollTo(0,0);}} style={{background:"none",border:"none",color:C.blue,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Ic n="back" sz={14} c={C.blue}/>Retour au chantier</button>
      </div>
      <div style={{display:"flex",gap:7,overflowX:"auto",padding:"11px 16px",borderBottom:`1px solid ${C.border}`,WebkitOverflowScrolling:"touch"}}>
        {SECTIONS.map(([id,l,ic])=>{const on=section===id;return(
          <button key={id} onClick={()=>{setSection(id);window.scrollTo(0,0);}} style={{flex:"0 0 auto",display:"flex",alignItems:"center",gap:6,padding:"8px 13px",borderRadius:9,border:"none",background:on?C.blue:C.soft,color:on?"#fff":C.muted,fontSize:12.5,fontWeight:on?600:500,fontFamily:FS,cursor:"pointer"}}><Ic n={ic} sz={14} c={on?"#fff":C.muted}/>{l}</button>
        );})}
      </div>
      <div style={{padding:"14px 16px"}}>
        <ErrorBoundary>
          {section==="contact"&&contactSec()}
          {section==="releve"&&releveSec()}
          {section==="devis"&&devisSec()}
          {section==="offre"&&offreSec()}
          {section==="chargement"&&chargementSec()}
          {section==="mail"&&mailSec()}
          {section==="facture"&&factureSec()}
        </ErrorBoundary>
      </div>
    </div>;
  };

  const terrainHours=()=>{ const {jobsList,label}=hoursData(hScale,hAnchor); const mine=(jobsList||[]).filter(x=>(x.equipe||[]).includes(me)); const myH=mine.reduce((s,x)=>s+num(x.heures),0); return <div>
    {terrainHeader("Mes heures",meMember?meMember.nom:"")}
    <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
      <div className="nb" style={{display:"flex",gap:7,overflowX:"auto"}}>
        {SCALES.map(([v2,l])=>{const on=hScale===v2;return <button key={v2} onClick={()=>setHScale(v2)} style={{flex:"0 0 auto",padding:"8px 16px",borderRadius:20,border:`1.5px solid ${on?"#7C3AED":C.border}`,background:on?"#7C3AED":"#fff",color:on?"#fff":C.muted,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer"}}>{l}</button>;})}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <button onClick={()=>setHAnchor(shiftPeriod(hScale,hAnchor,-1))} style={navArrow}><Ic n="back" sz={16}/></button>
        <div style={{fontFamily:FC,fontWeight:700,fontSize:13.5,textTransform:"capitalize",textAlign:"center",flex:1}}>{label}</div>
        <button onClick={()=>setHAnchor(shiftPeriod(hScale,hAnchor,1))} style={navArrow}><Ic n="chevR" sz={16}/></button>
      </div>
      <Card>
        <div style={{display:"flex",alignItems:"baseline",gap:10,justifyContent:"center"}}><span style={{fontSize:40,fontWeight:800,fontFamily:FC,color:"#7C3AED"}}>{myH.toFixed(0)}</span><span style={{fontSize:14,color:C.faint,fontFamily:FC}}>h · {mine.length} chantier{mine.length>1?"s":""}</span></div>
      </Card>
      <Card><Sec title="Mes chantiers sur la période"/>
        {mine.length===0&&<div style={{fontSize:12.5,color:C.faint,textAlign:"center",padding:"10px"}}>Aucun chantier assigné sur cette période.</div>}
        <div style={{display:"flex",flexDirection:"column"}}>
          {[...mine].sort((a,b)=>(a.dateDem||"").localeCompare(b.dateDem||"")).map(x=><div key={x.id} onClick={()=>{setSelId(x.id);setTScreen("job");window.scrollTo(0,0);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"11px 0",borderTop:"1px solid "+C.soft,cursor:"pointer"}}>
            <div style={{minWidth:0}}><div style={{fontSize:13.5,fontWeight:700,fontFamily:FC}}>{x.nom}</div><div style={{fontSize:11,color:C.faint}}>{x.dateDem?fmtL(x.dateDem):"—"} · {x.heureDem||""}</div></div>
            <span style={{fontFamily:FC,fontWeight:800,fontSize:15,color:C.text,flex:"0 0 auto"}}>{num(x.heures).toFixed(0)} h</span>
          </div>)}
        </div>
      </Card>
      <div style={{fontSize:11,color:C.faint,lineHeight:1.6,padding:"0 2px"}}>Heures issues du champ « heures » de chaque chantier où tu es affecté.</div>
    </div>
  </div>; };

  const terrainAgenda=()=> <div>
    <div style={{padding:"10px 16px 0"}}><div style={{padding:"9px 12px",background:C.blueL,border:"1px solid #BFDBFE",borderRadius:10,fontSize:11.5,color:"#1E40AF",display:"flex",alignItems:"center",gap:7}}><Ic n="cal" sz={15} c="#1E40AF"/>Ton agenda — uniquement les chantiers où tu es affecté.</div></div>
    {agendaView(me)}
  </div>;

  const terrainApp=()=>{
    if(!me) return <>{terrainLogin()}{TOAST}</>;
    return <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:C.bg,fontFamily:FS,color:C.text,paddingBottom:84,position:"relative",borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,minWidth:0}}>
      {tScreen==="jobs"&&terrainJobs()}
      {tScreen==="job"&&terrainJob()}
      {tScreen==="agenda"&&terrainAgenda()}
      {tScreen==="hours"&&terrainHours()}
      {tScreen==="mat"&&terrainMat()}
      {tScreen==="newd"&&terrainNew()}
      {tScreen==="full"&&terrainFull()}
      {terrainNav}
      {TOAST}
    </div>;
  };

  const launcher=()=>(
    <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:`linear-gradient(180deg,${C.navy},#0b1220)`,fontFamily:FS,color:"#fff",display:"flex",flexDirection:"column",justifyContent:"center",padding:"30px 22px",borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`}}>
      <div style={{textAlign:"center",marginBottom:34}}>
        <div style={{fontFamily:FC,fontWeight:800,fontSize:27,letterSpacing:".02em"}}>Roovers</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:6}}>Choisis ton espace</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {!terrainOnly&&<button onClick={()=>{setAppMode("bureau");setView("list");setSelId(null);}} style={{display:"flex",alignItems:"center",gap:15,padding:"20px",borderRadius:18,border:"none",background:"#fff",cursor:"pointer",textAlign:"left"}}>
          <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="folder" sz={26} c="#fff"/></div>
          <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:800,fontSize:18,color:C.navy}}>Bureau</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Dossiers, devis, agenda, équipe, flotte</div></div>
          <Ic n="chevR" sz={20} c={C.faint}/>
        </button>}
        <button onClick={()=>setAppMode("terrain")} style={{display:"flex",alignItems:"center",gap:15,padding:"20px",borderRadius:18,border:"none",background:"#fff",cursor:"pointer",textAlign:"left"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#8B5CF6,#6D28D9)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="truck" sz={26} c="#fff"/></div>
          <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:800,fontSize:18,color:C.navy}}>Terrain</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Mes chantiers, chrono, matériel, intake</div></div>
          <Ic n="chevR" sz={20} c={C.faint}/>
        </button>
      </div>
      <div style={{marginTop:28,textAlign:"center",fontSize:10.5,color:"rgba(255,255,255,.4)",lineHeight:1.6}}>Même base de données partagée — un dossier créé au terrain remonte au bureau « à valider ». En production : deux apps sur un seul backend.</div>
    </div>
  );

  /* ===== BOTTOM NAV ===== */
  /* ===== CRM : fiche client ===== */
  const clientDetail=(c)=>{
    const cd=crm[c.key]||{}; const stg=cStage(c);
    const ds=[...c.dossiers].sort((a,b)=>(b.dateDem||"").localeCompare(a.dateDem||""));
    return <div>
      <div style={{position:"sticky",top:0,zIndex:30,background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"14px 16px"}}>
        <button onClick={()=>setCrmClient(null)} style={{background:"none",border:"none",color:C.blue,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:10}}><Ic n="back" sz={14} c={C.blue}/>Clients</button>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:46,height:46,borderRadius:13,background:C.blueL,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="user" sz={22} c={C.blue}/></div>
          <div style={{minWidth:0,flex:1}}><div style={{fontFamily:FC,fontWeight:700,fontSize:18,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.nom}</div><div style={{fontSize:12,color:C.faint,marginTop:1}}>{c.dossiers.length} mission{c.dossiers.length>1?"s":""} · {eur(c.ca)} CA</div></div>
          <Badge c={stg.c}>{stg.l}</Badge>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <a href={c.tel?("tel:"+c.tel):undefined} style={{flex:1,textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"11px 6px",borderRadius:11,border:`1px solid ${C.border}`,background:"#fff",color:c.tel?C.blue:C.faint}}><Ic n="phone" sz={18} c={c.tel?C.blue:C.faint}/><span style={{fontSize:10.5,fontWeight:600,fontFamily:FS}}>Appeler</span></a>
          <a href={c.mail?("mailto:"+c.mail):undefined} style={{flex:1,textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"11px 6px",borderRadius:11,border:`1px solid ${C.border}`,background:"#fff",color:c.mail?C.blue:C.faint}}><Ic n="mail" sz={18} c={c.mail?C.blue:C.faint}/><span style={{fontSize:10.5,fontWeight:600,fontFamily:FS}}>E-mail</span></a>
          <button onClick={()=>{if(!c.tel){show("Pas de numéro");return;}window.open("https://wa.me/"+c.tel.replace(/\D/g,"").replace(/^0/,"32"),"_blank");}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"11px 6px",borderRadius:11,border:"none",background:"#22c55e",color:"#fff",cursor:"pointer"}}><Ic n="wa" sz={18} c="#fff"/><span style={{fontSize:10.5,fontWeight:600,fontFamily:FS}}>WhatsApp</span></button>
        </div>
        <Card style={{marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><div style={{fontSize:9.5,color:C.faint,textTransform:"uppercase",letterSpacing:".04em",fontFamily:FC}}>CA réalisé/signé</div><div style={{fontFamily:FC,fontWeight:700,fontSize:17,color:C.green}}>{eur(c.ca)}</div></div>
            <div><div style={{fontSize:9.5,color:C.faint,textTransform:"uppercase",letterSpacing:".04em",fontFamily:FC}}>Missions</div><div style={{fontFamily:FC,fontWeight:700,fontSize:17}}>{c.dossiers.length}</div></div>
            <div><div style={{fontSize:9.5,color:C.faint,textTransform:"uppercase",letterSpacing:".04em",fontFamily:FC}}>Première</div><div style={{fontSize:13,fontWeight:600}}>{c.firstDate?shortD(c.firstDate):"—"}</div></div>
            <div><div style={{fontSize:9.5,color:C.faint,textTransform:"uppercase",letterSpacing:".04em",fontFamily:FC}}>Dernière</div><div style={{fontSize:13,fontWeight:600}}>{c.lastDate?shortD(c.lastDate):"—"}</div></div>
          </div>
        </Card>
        <Card style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,fontFamily:FC,textTransform:"uppercase",letterSpacing:".05em"}}>Statut relation</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {[["auto","Auto"],["prospect","Prospect"],["actif","Actif"],["recurrent","Récurrent"],["perdu","Perdu"]].map(([v,l])=>{const on=(cd.stage||"auto")===v;return <button key={v} onClick={()=>setCStage(c.key,v)} style={{padding:"7px 12px",borderRadius:8,border:on?"none":`1px solid ${C.border}`,background:on?C.blue:"#fff",color:on?"#fff":C.muted,fontSize:12,fontWeight:on?700:500,fontFamily:FS,cursor:"pointer"}}>{l}</button>;})}
          </div>
        </Card>
        {cRelance(c)&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 13px",background:C.amberL,border:"1px solid #FCD34D",borderRadius:11,marginBottom:12,fontSize:12.5,color:"#92400E"}}><Ic n="alert" sz={15} c="#B45309"/>Devis en attente — à relancer.</div>}
        <Card style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,fontFamily:FC,textTransform:"uppercase",letterSpacing:".05em"}}>Suivi / notes</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input value={crmNote} onChange={e=>setCrmNote(e.target.value)} placeholder="Note d'échange…" style={{flex:1,padding:"9px 11px",borderRadius:9,border:`1px solid ${C.border}`,fontSize:13,fontFamily:FS,outline:"none",boxSizing:"border-box"}}/>
            <button onClick={()=>addCNote(c.key,crmNote)} style={{padding:"9px 14px",borderRadius:9,border:"none",background:C.blue,color:"#fff",fontWeight:700,fontSize:12.5,fontFamily:FS,cursor:"pointer"}}>Ajouter</button>
          </div>
          {(cd.notes||[]).length===0&&<div style={{fontSize:12,color:C.faint,fontStyle:"italic"}}>Aucune note pour l'instant.</div>}
          {(cd.notes||[]).map(n=><div key={n.id} style={{padding:"9px 0",borderTop:`1px solid ${C.soft}`}}><div style={{fontSize:13,color:C.text,lineHeight:1.4}}>{n.text}</div><div style={{fontSize:10.5,color:C.faint,marginTop:3,fontFamily:FC}}>{new Date(n.date).toLocaleString("fr-BE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div></div>)}
        </Card>
        <div style={{fontSize:11,fontWeight:700,color:C.muted,margin:"4px 0 9px",fontFamily:FC,textTransform:"uppercase",letterSpacing:".05em"}}>Historique ({ds.length})</div>
        {ds.map(d=>{const cp=compute(d);return <Card key={d.id} style={{marginBottom:9}}>
          <div onClick={()=>open(d.id)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:13.5,fontFamily:FC}}>{d.dateDem?shortD(d.dateDem):"Sans date"}</div><div style={{fontSize:11.5,color:C.faint,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{primCharge(d)||"—"} → {primDecharge(d)||"—"}</div></div>
            <div style={{textAlign:"right",flex:"0 0 auto"}}><Badge c={STATUTS[d.statut].c}>{STATUTS[d.statut].l}</Badge><div style={{fontFamily:FC,fontWeight:700,fontSize:13,marginTop:4}}>{eur(cp.tvac)}</div></div>
          </div>
        </Card>;})}
        <button onClick={()=>newForClient(c)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",border:"none",borderRadius:13,background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,color:"#fff",fontWeight:700,fontSize:13.5,fontFamily:FS,cursor:"pointer",marginTop:6}}><Ic n="plus" sz={17} c="#fff"/>Nouveau dossier pour ce client</button>
      </div>
    </div>;
  };
  /* ===== CRM : liste clients ===== */
  const clientsView=()=>{
    const all=buildClients();
    if(crmClient){const c=all.find(x=>x.key===crmClient);if(c)return clientDetail(c);}
    const total=all.length;
    const prospects=all.filter(c=>cPhase(c).k==="prospect").length;
    const actifs=all.filter(c=>["actif","client","recurrent"].includes(cPhase(c).k)).length;
    const relances=all.filter(cRelance).length;
    let list=all;
    if(crmFilter==="relancer")list=all.filter(cRelance);
    else if(crmFilter==="recurrent")list=all.filter(c=>(c.statuses.effectue||0)>=2||c.dossiers.length>=2||c.recurrent);
    else if(crmFilter==="prospect")list=all.filter(c=>cPhase(c).k==="prospect");
    if(crmSearch.trim())list=list.filter(c=>c.nom.toLowerCase().includes(crmSearch.toLowerCase()));
    list=[...list].sort((a,b)=>(b.lastDate||"").localeCompare(a.lastDate||""));
    const Stat=(lbl,val,col)=><div style={{flex:1,background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 6px",textAlign:"center"}}><div style={{fontFamily:FC,fontWeight:700,fontSize:19,color:col||C.text}}>{val}</div><div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:".03em",marginTop:2}}>{lbl}</div></div>;
    return <div>
      <div style={{position:"sticky",top:0,zIndex:30,background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"14px 16px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:9,background:C.blueL,display:"grid",placeItems:"center"}}><Ic n="user" sz={18} c={C.blue}/></div>
          <div><div style={{fontFamily:FC,fontWeight:700,fontSize:17}}>Clients</div><div style={{fontSize:11,color:C.faint}}>CRM · {total} fiche{total>1?"s":""}</div></div>
        </div>
        <input value={crmSearch} onChange={e=>setCrmSearch(e.target.value)} placeholder="Rechercher un client…" style={{width:"100%",padding:"10px 13px",borderRadius:10,border:`1px solid ${C.border}`,fontSize:13.5,fontFamily:FS,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:8,marginBottom:14}}>{Stat("Clients",total)}{Stat("Prospects",prospects,C.muted)}{Stat("Actifs",actifs,C.blue)}{Stat("À relancer",relances,relances?"#B45309":C.faint)}</div>
        <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto"}}>
          {[["all","Tous"],["relancer","À relancer"],["recurrent","Récurrents"],["prospect","Prospects"]].map(([v,l])=>{const on=crmFilter===v;return <button key={v} onClick={()=>setCrmFilter(v)} style={{flex:"0 0 auto",padding:"7px 13px",borderRadius:8,border:on?"none":`1px solid ${C.border}`,background:on?C.blue:"#fff",color:on?"#fff":C.muted,fontSize:12.5,fontWeight:on?700:500,fontFamily:FS,cursor:"pointer"}}>{l}</button>;})}
        </div>
        {list.length===0&&<Card><div style={{textAlign:"center",padding:"18px",color:C.faint,fontSize:13}}>Aucun client.</div></Card>}
        {list.map(c=>{const stg=cStage(c);const rel=cRelance(c);return <Card key={c.key} style={{marginBottom:10}}>
          <div onClick={()=>{setCrmClient(c.key);setCrmNote("");window.scrollTo(0,0);}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:42,height:42,borderRadius:12,background:C.blueL,display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="user" sz={20} c={C.blue}/></div>
            <div style={{minWidth:0,flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontFamily:FC,fontWeight:700,fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.nom}</span>{rel&&<span style={{width:7,height:7,borderRadius:"50%",background:"#F59E0B",flex:"0 0 auto"}}/>}</div>
              <div style={{fontSize:11.5,color:C.faint,marginTop:2}}>{c.dossiers.length} mission{c.dossiers.length>1?"s":""} · {eur(c.ca)}{c.lastDate?(" · "+shortD(c.lastDate)):""}</div>
            </div>
            <Badge c={stg.c}>{stg.l}</Badge>
          </div>
        </Card>;})}
      </div>
    </div>;
  };
  /* ===== PARAMÈTRES : prix, marges, facturation Peppol ===== */
  const setS=(path,val)=>setSettings(o=>{const n={...o};const ks=path.split(".");let t=n;for(let i=0;i<ks.length-1;i++){t[ks[i]]={...(t[ks[i]]||{})};t=t[ks[i]];}t[ks[ks.length-1]]=val;return n;});
  const setRate=(i,k,v)=>setSettings(o=>({...o,rates:o.rates.map((r,j)=>j===i?{...r,[k]:v}:r)}));
  const addRate=()=>setSettings(o=>({...o,rates:[...o.rates,{w:"",h:""}]}));
  const rmRate=(i)=>setSettings(o=>({...o,rates:o.rates.filter((_,j)=>j!==i)}));
  const setMat=(i,k,v)=>setSettings(o=>({...o,material:o.material.map((m,j)=>j===i?{...m,[k]:v}:m)}));
  const settingsView=()=>{
    const st=settings;
    const Head=(t,sub)=><div style={{marginBottom:12}}><div style={{fontFamily:FC,fontWeight:800,fontSize:12.5,color:C.navy,textTransform:"uppercase",letterSpacing:".06em"}}>{t}</div>{sub&&<div style={{fontSize:11,color:C.faint,marginTop:3,textTransform:"none",letterSpacing:0,fontFamily:FS}}>{sub}</div>}</div>;
    return <div>
      <div style={{position:"sticky",top:0,zIndex:30,background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"14px 16px"}}>
        <button onClick={()=>setView("list")} style={{background:"none",border:"none",color:C.blue,fontSize:12.5,fontWeight:600,fontFamily:FS,cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:8}}><Ic n="back" sz={14} c={C.blue}/>Dossiers</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:C.blueL,display:"grid",placeItems:"center"}}><Ic n="wrench" sz={17} c={C.blue}/></div>
          <div><div style={{fontFamily:FC,fontWeight:700,fontSize:17}}>Paramètres</div><div style={{fontSize:11,color:C.faint}}>Prix, marges & facturation — appliqués en direct</div></div>
        </div>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
        <Card>{Head("Entreprise","Identité reprise sur les offres & factures")}
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <Field label="Raison sociale" value={st.company.name} onChange={v=>setS("company.name",v)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              <Field label="BCE" value={st.company.bce} onChange={v=>setS("company.bce",v)} mono/>
              <Field label="N° TVA" value={st.company.tvaNum} onChange={v=>setS("company.tvaNum",v)} mono/>
            </div>
            <Field label="IBAN" value={st.company.iban} onChange={v=>setS("company.iban",v)} mono/>
            <Field label="BIC" value={st.company.bic} onChange={v=>setS("company.bic",v)} mono placeholder="GEBABEBB"/>
            <Field label="Adresse (dépôt)" value={st.company.addr} onChange={v=>setS("company.addr",v)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              <Field label="E-mail" value={st.company.email} onChange={v=>setS("company.email",v)}/>
              <Field label="Téléphone" value={st.company.tel} onChange={v=>setS("company.tel",v)} mono/>
            </div>
          </div>
        </Card>
        <Card>{Head("Facturation Peppol","Facturation électronique structurée (Belgique)")}
          <Switch label="Activer la facturation Peppol" on={!!st.peppol.enabled} onToggle={()=>setS("peppol.enabled",!st.peppol.enabled)}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:11,marginTop:11}}>
            <Field label="Schéma" value={st.peppol.scheme} onChange={v=>setS("peppol.scheme",v)} mono hint="0208=BCE"/>
            <Field label="Identifiant participant" value={st.peppol.participant} onChange={v=>setS("peppol.participant",v)} mono placeholder="0478363616"/>
          </div>
          <div style={{marginTop:8,fontSize:10.5,color:C.muted,fontFamily:FC,background:C.soft,borderRadius:8,padding:"7px 10px"}}>Endpoint Peppol : {(st.peppol.scheme||"0208")+":"+(st.peppol.participant||"—")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginTop:11}}>
            <Field label="Préfixe n° facture" value={st.invoice.prefix} onChange={v=>setS("invoice.prefix",v)} mono placeholder="RV"/>
            <Field label="Prochain n°" value={st.invoice.next} onChange={v=>setS("invoice.next",v)} mono type="number"/>
          </div>
          <div style={{marginTop:11}}><TA label="Pied de facture" value={st.invoice.footer} onChange={v=>setS("invoice.footer",v)}/></div>
        </Card>
        <Card>{Head("Barème main-d'œuvre","Tarif horaire TVAC par configuration — appliqué au devis")}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {st.rates.map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end"}}>
              <Field label={i===0?"Déménageurs":undefined} value={r.w} onChange={v=>setRate(i,"w",v)} mono type="number"/>
              <Field label={i===0?"€ / h (TVAC)":undefined} value={r.h} onChange={v=>setRate(i,"h",v)} mono type="number"/>
              <button onClick={()=>rmRate(i)} style={{width:46,height:46,borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="x" sz={16} c={C.red}/></button>
            </div>)}
            <Btn v="sec" sz="sm" icon="plus" onClick={addRate}>Ajouter un palier</Btn>
          </div>
        </Card>
        <Card>{Head("Déplacement & options")}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Prix / km (€)" value={st.prixKm} onChange={v=>setS("prixKm",v)} mono type="number"/>
            <Field label="Monte-meubles (€/jour)" value={st.lift} onChange={v=>setS("lift",v)} mono type="number"/>
          </div>
        </Card>
        <Card>{Head("Matériel — prix unitaires (€)")}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {st.material.map((m,i)=><div key={m.k} style={{display:"grid",gridTemplateColumns:"1fr 116px",gap:10,alignItems:"center"}}>
              <span style={{fontSize:13,color:C.text}}>{m.l}</span>
              <Field value={m.p} onChange={v=>setMat(i,"p",v)} mono type="number"/>
            </div>)}
          </div>
        </Card>
        <Card>{Head("Marges & TVA","Objectif de marge de l'instrument du devis")}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <Field label="Marge cible min (%)" value={st.margin.min} onChange={v=>setS("margin.min",v)} mono type="number"/>
            <Field label="Marge cible max (%)" value={st.margin.max} onChange={v=>setS("margin.max",v)} mono type="number"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginTop:11}}>
            <Field label="TVA (%)" value={st.tva} onChange={v=>setS("tva",v)} mono type="number"/>
            <Field label="Acompte par défaut (%)" value={st.depositPct} onChange={v=>setS("depositPct",v)} mono type="number"/>
          </div>
        </Card>
        <Card>{Head("Conditions générales","Affichées sur l'offre — une clause par ligne (vide = CGV par défaut)")}
          <TA label="" value={st.cgv} onChange={v=>setS("cgv",v)} placeholder="1. ...\n2. ..."/>
        </Card>
        <div style={{fontSize:11,color:C.faint,textAlign:"center",padding:"2px 8px 6px",lineHeight:1.5}}>Enregistré automatiquement · appliqué en direct aux devis, offres et factures.</div>
      </div>
    </div>;
  };
  const chTab=(on)=>({padding:"7px 13px",borderRadius:20,border:"1.5px solid "+(on?C.blue:C.border),background:on?C.blue:"#fff",color:on?"#fff":C.muted,fontSize:12.5,fontWeight:600,fontFamily:FS,whiteSpace:"nowrap",cursor:"pointer",flex:"0 0 auto"});
  const chatView=()=>{
    const known=Object.values(keyring).sort((a,b)=>String(a.name||"").localeCompare(String(b.name||"")));
    const chName=chatCh==="general"?"Général":((groups.find(g=>g.id===chatCh)||{}).name||"Groupe");
    const thread=msgs.filter(m=>m.ch===chatCh);
    return <div style={{position:"fixed",inset:0,zIndex:90,background:C.bg,maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",fontFamily:FS}}>
      <div style={{padding:"12px 14px",borderBottom:"1px solid "+C.border,background:C.surf,display:"flex",alignItems:"center",gap:10,flex:"0 0 auto"}}>
        <button onClick={()=>{setChatOpen(false);setChatPane("thread");}} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="x" sz={20} c={C.muted}/></button>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FC,fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:6}}><Ic n="lock" sz={13} c={C.green}/>Messagerie chiffrée</div><div style={{fontSize:10.5,color:C.faint}}>Bout en bout · {known.length} appareil{known.length>1?"s":""}</div></div>
        {ident&&<button aria-label="Identité et empreintes de sécurité" onClick={()=>setChatPane(chatPane==="id"?"thread":"id")} style={{background:chatPane==="id"?C.blueL:"#fff",border:"1.5px solid "+C.border,borderRadius:9,width:36,height:36,display:"grid",placeItems:"center",cursor:"pointer",flex:"0 0 auto"}}><Ic n="shield" sz={16} c={C.blue}/></button>}
      </div>

      {!ident ? (
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:14,padding:28,textAlign:"center"}}>
          <div style={{width:58,height:58,borderRadius:16,background:C.blueL,display:"grid",placeItems:"center"}}><Ic n="lock" sz={28} c={C.blue}/></div>
          <div style={{fontWeight:800,fontSize:18,color:C.navy}}>Crée ton identité chiffrée</div>
          <div style={{fontSize:12.5,color:C.muted,lineHeight:1.6,maxWidth:300}}>Tes clés sont générées sur cet appareil et n'en sortent jamais. Sans elles, personne — pas même le serveur — ne peut lire tes messages.</div>
          <div style={{width:"100%",maxWidth:300}}><Field label="Ton nom" value={setupName} onChange={setSetupName} placeholder="Ex : Raphaël"/></div>
          <Btn v="blue" onClick={()=>{ if(!chatBusy) setupIdentity(setupName); }}>{chatBusy?"Génération…":"Générer mes clés"}</Btn>
          {!cryptoOK()&&<div style={{fontSize:11,color:C.red}}>Chiffrement indisponible dans ce contexte.</div>}
        </div>
      ) : chatPane==="id" ? (
        <div style={{flex:1,overflow:"auto",padding:16,display:"flex",flexDirection:"column",gap:14}}>
          <Card><Sec title="Mon identité"/>
            <div style={{fontSize:13.5,fontWeight:700}}>{ident.name}</div>
            <div style={{marginTop:8,fontSize:10.5,color:C.faint}}>Empreinte de sécurité (à comparer de vive voix) :</div>
            <div style={{fontFamily:FC,fontWeight:700,fontSize:14,color:C.navy,letterSpacing:".05em",marginTop:3}}>{fps[ident.deviceId]||"…"}</div>
          </Card>
          <Card><Sec title="Appareils connus"/>
            <div style={{fontSize:11,color:C.faint,marginBottom:8,lineHeight:1.5}}>Vérifie l'empreinte d'une personne avec elle (en personne ou par téléphone) avant d'échanger du sensible.</div>
            {known.map(k=><div key={k.id} style={{padding:"9px 0",borderTop:"1px solid "+C.soft,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
              <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600}}>{k.name}{k.id===ident.deviceId?" (moi)":""}</div><div style={{fontFamily:FC,fontSize:10.5,color:C.muted}}>{fps[k.id]||"…"}</div></div>
            </div>)}
            {known.length===0&&<div style={{fontSize:12,color:C.faint}}>Aucun appareil pour l'instant.</div>}
          </Card>
          <div style={{fontSize:10,color:C.faint,lineHeight:1.6,padding:"0 4px"}}>Chiffrement de bout en bout : ECDH P-256 + AES-256-GCM, signatures ECDSA. Le stockage ne contient que du chiffré. Distribution des clés en confiance-à-l'usage (TOFU) : les empreintes permettent la vérification hors-ligne. Pas de secret de transmission persistant (clés statiques) — pour du très sensible, un canal dédié reste préférable.</div>
        </div>
      ) : (
        <>
          <div style={{display:"flex",gap:7,padding:"10px 12px",overflowX:"auto",borderBottom:"1px solid "+C.soft,background:C.surf,flex:"0 0 auto"}}>
            <button onClick={()=>setChatCh("general")} style={chTab(chatCh==="general")}>Général</button>
            {groups.filter(g=>(g.members||[]).includes(ident.deviceId)).map(g=><button key={g.id} onClick={()=>setChatCh(g.id)} style={chTab(chatCh===g.id)}>{g.name}</button>)}
            <button onClick={()=>{setChatPane("new");setGrpName("");setGrpSel([]);}} style={Object.assign({},chTab(false),{borderStyle:"dashed",color:C.blue})}>+ Groupe</button>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"12px 12px 6px",display:"flex",flexDirection:"column",gap:9}}>
            {thread.length===0&&<div style={{textAlign:"center",color:C.faint,fontSize:12,marginTop:34}}>Aucun message dans « {chName} ».<br/>Écris le premier.</div>}
            {thread.map(m=>{ const mine=m.from===ident.deviceId; const dd=decoded[m.id]; return <div key={m.id} style={{alignSelf:mine?"flex-end":"flex-start",maxWidth:"82%"}}>
              <div style={{fontSize:10,color:C.faint,marginBottom:2,textAlign:mine?"right":"left"}}>{mine?"Moi":(m.fromName||"?")} · {new Date(m.ts).toLocaleTimeString("fr-BE",{hour:"2-digit",minute:"2-digit"})}</div>
              <div style={{padding:"9px 12px",borderRadius:14,background:mine?C.blue:"#fff",color:mine?"#fff":C.text,border:mine?"none":"1px solid "+C.border,fontSize:13.5,lineHeight:1.45,wordBreak:"break-word",whiteSpace:"pre-wrap"}}>{dd?(dd.text!=null?dd.text:(dd.locked?"🔒 réservé à un autre groupe":"⚠️ illisible")):"…"}</div>
              {dd&&dd.text!=null&&<div style={{fontSize:9,color:dd.verified?C.green:C.amber,marginTop:2,textAlign:mine?"right":"left"}}>{dd.verified?"chiffré · signé ✓":"chiffré · signature non vérifiée"}</div>}
            </div>; })}
          </div>
          <div style={{padding:"10px 12px",borderTop:"1px solid "+C.border,background:C.surf,display:"flex",gap:8,alignItems:"flex-end",flex:"0 0 auto"}}>
            <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder={"Message à « "+chName+" »…"} rows={1} style={{flex:1,resize:"none",padding:"10px 12px",borderRadius:11,border:"1.5px solid "+C.border,fontFamily:FS,fontSize:13.5,maxHeight:90,outline:"none",lineHeight:1.4}}/>
            <button aria-label="Envoyer le message" onClick={()=>{ if(!chatBusy&&draft.trim()) sendMsg(); }} style={{width:44,height:44,borderRadius:11,border:"none",background:draft.trim()?C.blue:"#cfd8ea",cursor:draft.trim()?"pointer":"default",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Ic n="send" sz={18} c="#fff"/></button>
          </div>
        </>
      )}

      {ident&&chatPane==="new"&&<div style={{position:"absolute",inset:0,background:"rgba(15,23,42,.45)",display:"flex",alignItems:"flex-end",zIndex:5}} onClick={()=>setChatPane("thread")}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:C.bg,borderRadius:"18px 18px 0 0",padding:18,maxHeight:"82%",overflow:"auto"}}>
          <div style={{fontFamily:FC,fontWeight:700,fontSize:16,marginBottom:12}}>Nouveau groupe</div>
          <Field label="Nom du groupe" value={grpName} onChange={setGrpName} placeholder="Ex : Chefs d'équipe"/>
          <div style={{fontSize:11,color:C.faint,margin:"13px 0 6px"}}>Membres (toi inclus automatiquement)</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {known.filter(k=>k.id!==ident.deviceId).map(k=>{ const on=grpSel.includes(k.id); return <button key={k.id} onClick={()=>setGrpSel(on?grpSel.filter(x=>x!==k.id):[...grpSel,k.id])} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",borderRadius:10,border:"1.5px solid "+(on?C.blue:C.border),background:on?C.blueL:"#fff",cursor:"pointer"}}><span style={{fontSize:13,fontWeight:on?600:500}}>{k.name}</span>{on&&<Ic n="check" sz={15} c={C.blue}/>}</button>; })}
            {known.filter(k=>k.id!==ident.deviceId).length===0&&<div style={{fontSize:12,color:C.faint}}>Personne d'autre n'a encore créé son identité sur ce réseau.</div>}
          </div>
          <div style={{display:"flex",gap:9,marginTop:16}}>
            <Btn v="sec" full onClick={()=>setChatPane("thread")}>Annuler</Btn>
            <Btn v="blue" full onClick={()=>{ if(grpName.trim()) createGroup(grpName,grpSel); }}>Créer le groupe</Btn>
          </div>
        </div>
      </div>}
    </div>;
  };

  const bottomNav=(
    <div className="no-print" style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,zIndex:50,background:C.surf,borderTop:`1px solid ${C.border}`,display:"flex",padding:"7px 6px 10px",boxShadow:"0 -4px 20px rgba(15,23,42,.06)"}}>
      {[["list","Dossiers","folder"],["clients","Clients","user"],["agenda","Agenda","cal"],["equipe","Équipe","users"]].map(([v2,l,ic])=>{const on=(v2==="list"&&(view==="list"||view==="detail"))||view===v2;return(
        <button key={v2} onClick={()=>{setView(v2);if(v2==="list")setSelId(null);if(v2==="clients")setCrmClient(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 2px",background:"none",border:"none",cursor:"pointer",color:on?C.blue:C.faint}}>
          <Ic n={ic} sz={21} c={on?C.blue:C.faint}/><span style={{fontSize:10,fontWeight:on?700:500,fontFamily:FS}}>{l}</span>
        </button>
      );})}
      <button onClick={view==="clients"?openNewClient:(fieldMode?createTerrain:create)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 2px",background:"none",border:"none",cursor:"pointer",color:fieldMode?"#7C3AED":C.blue}}>
        <span style={{width:34,height:34,borderRadius:"50%",background:fieldMode?"linear-gradient(135deg,#8B5CF6,#6D28D9)":`linear-gradient(135deg,${C.blue},${C.blueDk})`,display:"grid",placeItems:"center",boxShadow:fieldMode?"0 4px 12px -2px rgba(124,58,237,.5)":"0 4px 12px -2px rgba(37,99,235,.5)"}}><Ic n="plus" sz={19} c="#fff"/></span>
        <span style={{fontSize:10,fontWeight:600,fontFamily:FS}}>{view==="clients"?"Client":(fieldMode?"Devis":"Nouveau")}</span>
      </button>
    </div>
  );

  // Garde dure : quel que soit appMode, un compte terrain ne rend QUE l'app
  // terrain. Aucun bouton interne (Quitter, Accueil…) ne peut l'en sortir.
  if(terrainOnly||appMode==="terrain") return <ErrorBoundary full onReset={()=>{setTScreen("jobs");setCrmClient(null);}}>{terrainApp()}{FEATURES.messaging&&chatOpen&&chatView()}</ErrorBoundary>;
  if(appMode==="launch") return <ErrorBoundary full onReset={safeReset}>{launcher()}</ErrorBoundary>;
  return (
    <ErrorBoundary full onReset={safeReset}>
    <div style={{minHeight:"100vh",maxWidth:480,margin:"0 auto",background:C.bg,fontFamily:FS,color:C.text,paddingBottom:84,position:"relative",borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,minWidth:0}}>
      {!storageOK&&<div className="no-print" style={{padding:"7px 14px",background:C.amberL,borderBottom:`1px solid #FCD34D`,fontSize:11,color:"#92400E",textAlign:"center"}}>Sauvegarde de session uniquement sur cet appareil.</div>}
      {view==="list"&&listView()}
      {view==="detail"&&d&&detailView()}
      {view==="agenda"&&agendaView()}
      {view==="equipe"&&equipeView()}
      {view==="clients"&&clientsView()}
      {view==="params"&&settingsView()}
      {FEATURES.messaging&&chatOpen&&chatView()}
      {newClientOpen&&<div onClick={()=>setNewClientOpen(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:80,display:"flex",alignItems:"flex-end"}}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,margin:"0 auto",background:C.bg,borderRadius:"18px 18px 0 0",padding:18,maxHeight:"90%",overflow:"auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}><div style={{fontFamily:FC,fontWeight:700,fontSize:16}}>Nouveau client récurrent</div><button onClick={()=>setNewClientOpen(false)} style={{background:"none",border:"none",cursor:"pointer",padding:2}}><Ic n="x" sz={20} c={C.muted}/></button></div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <Field label="Nom du contact" value={ncForm.nom} onChange={v=>setNcForm(f=>({...f,nom:v}))} placeholder="Ex : Régie Dupont"/>
            <Field label="Société" value={ncForm.societe} onChange={v=>setNcForm(f=>({...f,societe:v}))} placeholder="Optionnel"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}><Field label="Téléphone" value={ncForm.tel} onChange={v=>setNcForm(f=>({...f,tel:v}))} icon="phone" mono placeholder="04XX…"/><Field label="TVA" value={ncForm.tva} onChange={v=>setNcForm(f=>({...f,tva:v}))} mono placeholder="BE 0…"/></div>
            <Field label="Email" type="email" value={ncForm.mail} onChange={v=>setNcForm(f=>({...f,mail:v}))} icon="mail" placeholder="@"/>
            <TA label="Note (type de client, fréquence, conditions…)" value={ncForm.note} onChange={v=>setNcForm(f=>({...f,note:v}))}/>
            <div style={{display:"flex",gap:9,marginTop:4}}><Btn v="sec" full onClick={()=>setNewClientOpen(false)}>Annuler</Btn><Btn v="blue" full onClick={addClient}>Ajouter le client</Btn></div>
          </div>
        </div>
      </div>}
      {bottomNav}
      {toast&&<div className="no-print" style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:C.navy,color:"#fff",padding:"11px 18px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:FS,zIndex:99,display:"flex",alignItems:"center",gap:8,boxShadow:"0 14px 40px -10px rgba(0,0,0,.6)",animation:"rUp .25s ease"}}><Ic n="check" sz={15} c="#86efac"/>{toast}</div>}
    </div>
    </ErrorBoundary>
  );
}

const qBtn={width:30,height:30,borderRadius:8,border:`1.5px solid ${C.border}`,background:"#fff",cursor:"pointer",fontSize:17,fontWeight:700,color:C.text,display:"grid",placeItems:"center",lineHeight:1,flex:"0 0 auto"};
const navArrow={width:38,height:38,borderRadius:10,border:`1.5px solid ${C.border}`,background:"#fff",display:"grid",placeItems:"center",cursor:"pointer"};
