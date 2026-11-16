'use strict';
// Copy the desired project entry into showcase-content.js; add only real material.
window.PORTAL_SHOWCASE = {
 version: 1,
 projects: {
  finanse: {
   symbol: '◈',
   video: 'assets/demos/finance.mp4',
   captions: [{src:'assets/demos/finance-pl.vtt',srclang:'pl',label:'Polski',default:true}],
   before: 'assets/demos/finance-before.png',
   after: 'assets/demos/finance-after.png',
   goal: 'Wpisz własny, prawdziwy opis celu projektu.',
   challenge: 'Opisz faktyczny problem napotkany podczas pracy.',
   lesson: 'Opisz, czego nauczyła Cię ta praca.',
   timeline: [
    {title:'Pomysł',description:'Twój opis pierwszego etapu.'},
    {title:'Prototyp',description:'Twój opis prototypu.'},
    {title:'Publikacja',description:'Twój opis publikacji.'}
   ],
   en: {
    goal: 'Your own English description.',
    challenge: 'Your own English account of the challenge.',
    lesson: 'Your own English account of what you learned.'
   }
  }
 }
};
