// data/documents/attendance-policy.js
//
// The full text of the JLA Attendance and Fining Policy, converted from
// the source .docx and rendered on-page by common/DocumentReader.jsx.
// PDF: public/documents/jlaattendance.pdf
//
// CLAUSE NUMBERS WERE RECOVERED, NOT INVENTED
// This document numbers its clauses using Word's automatic numbering,
// which means the visible numbers ("1.", "2.", "i.", "II.") exist only in
// Word's rendering and are absent from the extracted text. Numbering here
// was rebuilt by reading the document's numbering definitions (numId /
// ilvl / numFmt) and counting in document order.
// That reconstruction is VERIFIED against the document's own internal
// cross-reference: clause 9 cites "article 6(II)", and the rebuilt
// numbering places at 6(II) exactly the reserved-discretion provision
// that the citation refers to. Numbers in a fining policy are what members
// cite when disputing a penalty, so guessing them was not acceptable.
//
// TEXT IS VERBATIM, INCLUDING ERRORS
// Source spellings are preserved exactly — "Displinary Master" (clauses
// 6 and 12) and "Offense"/"Offences" mixed usage appear as written. This
// is an enacted policy; silently correcting it here would publish text
// that differs from the signed document. Fix the source, then re-convert.
//
// BLOCK TYPES
//   text       — a plain paragraph within a clause
//   definition — a "Term - meaning" pair (clause 4)
//   list       — a numbered sub-list; `numeral` records the source format
//                (lowerRoman / upperRoman / lowerLetter) so DocumentReader
//                renders i., ii. vs I., II. vs a), b) as the original does.
//                `start` is a zero-based offset for sequences that are
//                INTERRUPTED by a nested list and must resume rather than
//                restart. Clause 6 is the reason this exists: its upperRoman
//                sequence runs I., then a nested lowerRoman list of excusable
//                grounds intervenes, then it resumes at II. Without `start`
//                the resumed block would restart at I. and the document's own
//                cross-reference to "article 6(II)" would point at the wrong
//                provision.
//
// ⚠️ NOT ADOPTED: the certification block carries an unfilled date
// ("the ____ day of __________ 20____"). The policy names itself
// "Attendance and Fining Policy, 2026" but records no adoption date, so
// none is published. See `certification` below.

const attendancePolicy = {
  id: "attendance-policy",
  title: "Attendance and Fining Policy",
  shortTitle: "Attendance & Fining Policy",
  sectionLabel: "Clause",
  version: "2026",

  intro:
    "The attendance and fining policy serves as a guide in instituting disciplinary penalties to members and office bearers by keeping them on toes and ensure discipline in attendance of, not limited to physical and virtual meeting, summits, hangouts and any form of convergence that requires their presence",

  clauses: [
    {
      id: "clause-1",
      number: 1,
      text: "This policy shall be cited as the Attendance and Fining Policy of the Juris Leadership Alliance (hereinafter known as (JLA))",
      blocks: [],
    },
    {
      id: "clause-2",
      number: 2,
      text: "This policy aims to, inter alia, enforce regular participation, strengthen discipline, and define consequences for unjustified absenteeism among members and office bearers. The policy enhances operational efficiency and ensures commitment to the objectives of JLA encompassed in JLA constitution.",
      blocks: [],
    },
    {
      id: "clause-3",
      number: 3,
      text: "This policy applies to;",
      blocks: [
        {
          type: "list",
          numeral: "lowerRoman",
          items: [
            "All elected and appointed members of the Executive Committee,",
            "All members of the JLA.",
          ],
        },
      ],
    },
    {
      id: "clause-4",
      number: 4,
      text: "Definitions:",
      blocks: [
        {
          type: "definition",
          term: "Attendance",
          text: "Physical or virtual presence for at least 66% of the meeting/event duration.",
        },
        {
          type: "definition",
          term: "Unexcused Absence",
          text: "Absence without prior written approval or acceptable justification.",
        },
        {
          type: "definition",
          term: "Excused Absence",
          text: "Absence supported by documentation or approved in writing by the Secretary at least 24 hours prior.",
        },
        {
          type: "definition",
          term: "Fine",
          text: "A monetary penalty levied for repeated unexcused absences.",
        },
        {
          type: "definition",
          term: "Warning",
          text: "A formal notice issued for a first violation.",
        },
        {
          type: "definition",
          term: "Suspension",
          text: "Temporary removal from duties pending review and/or temporary revocation of membership.",
        },
      ],
    },
    {
      id: "clause-5",
      number: 5,
      text: "All members are expected to:",
      blocks: [
        {
          type: "list",
          numeral: "lowerRoman",
          items: [
            "Attend, and on time, scheduled JLA meetings and officially convened events.",
            "Sign official attendance registers physically or confirm via digital platforms (e.g. Google Form).",
          ],
        },
        { type: "text", text: "The Secretary in Organization meetings must maintain attendance records and Organ heads in organ meetings." },
      ],
    },
    {
      id: "clause-6",
      number: 6,
      text: "A member may request an excused absence under the following grounds:",
      blocks: [
        {
          type: "list",
          numeral: "upperRoman",
          items: [
            "Excusable grounds:",
          ],
        },
        {
          type: "list",
          numeral: "lowerRoman",
          items: [
            "Academic obligations (e.g. examinations or lectures).",
            "Medical emergencies (with supporting documentation(s)).",
            "Bereavement or serious family emergencies.",
            "Religious holidays and ceremonies.",
            "Official university-sanctioned obligations.",
          ],
        },
        {
          type: "list",
          numeral: "upperRoman",
          start: 1,
          items: [
            "The Chairman, the Deputy Chair and the Displinary Master have reserved powers of discretion as to what amounts to reasonable and excusable grounds.",
            "Requests must be submitted in writing via an email to the Secretary in meetings at least 8 hours prior, unless in emergencies.",
            "In cases of emergencies, justifications shall be sent to the respective heads as soonest as possible. The Chair, Vice Chair shall have reserved powers stipulated hereinabove under article 6(II).",
          ],
        },
      ],
    },
    {
      id: "clause-7",
      number: 7,
      text: "Offense Thresholds for Sanction;",
      blocks: [
        {
          type: "list",
          numeral: "lowerRoman",
          items: [
            "General Members: three or more unexcused absences.",
            "Office bearers: two or more unexcused absences.",
          ],
        },
        { type: "text", text: "Absences shall be counted cumulatively across all official JLA activities, including sub-committee sessions." },
      ],
    },
    {
      id: "clause-8",
      number: 8,
      text: "Offences shall have the following classifications;",
      blocks: [
        {
          type: "list",
          numeral: "upperRoman",
          items: [
            "Any:",
          ],
        },
        {
          type: "list",
          numeral: "lowerRoman",
          items: [
            "First and/or second offence, which shall be termed and classified as minor and moderate offences respectively, whose sanctions, shall be a written warning.",
            "Third offence, which shall be termed and classified as a serious offence, whose sanction shall be a fine of Ksh. 250.",
            "Fourth and/or more than four offences, which shall be termed and classified as critical offences, whose sanction shall be suspension pending disciplinary review.",
            "Missing of meeting to the executive shall amount to Kshs. 150 – in any meeting they miss.",
          ],
        },
        {
          type: "list",
          numeral: "upperRoman",
          start: 1,
          items: [
            "All fines shall be directed to the Finance Director within 14 calendar days.",
            "Non-payment results in ineligibility to:",
          ],
        },
        {
          type: "list",
          numeral: "lowerLetter",
          items: [
            "Vote in any meeting;",
            "Participate in official JLA activities and organ functions",
            "Contest for any elective office.",
          ],
        },
      ],
    },
    {
      id: "clause-9",
      number: 9,
      text: "The Secretary shall monitor attendance, issue warnings or direct organ heads to issue warnings to the respective members, and notify the Finance Director of violations.",
      blocks: [],
    },
    {
      id: "clause-10",
      number: 10,
      text: "The Finance Director shall issue invoices, track payments, and publish a monthly accountability report at the request of the Office the Chairman",
      blocks: [],
    },
    {
      id: "clause-11",
      number: 11,
      text: "The Office of the Head of Discipline shall initiate disciplinary processes and enforce suspensions where applicable.",
      blocks: [],
    },
    {
      id: "clause-12",
      number: 12,
      text: "To regain active member status:",
      blocks: [
        {
          type: "list",
          numeral: "lowerLetter",
          items: [
            "The member must pay all outstanding fines;",
            "Submit a letter of commitment or apology to the Executive;",
            "Complete a compensatory task assigned by the Displinary Master or their designee.",
          ],
        },
      ],
    },
    {
      id: "clause-13",
      number: 13,
      text: "Office bearers fined three times or more shall not be eligible for re-election or reappointment.",
      blocks: [],
    },
    {
      id: "clause-14",
      number: 14,
      text: "Persistent absenteeism shall be cited as a ground for vote of no confidence or early termination of tenure.",
      blocks: [],
    },
    {
      id: "clause-15",
      number: 15,
      text: "Proposed amendments must be approved by a two-thirds majority vote in a General Assembly",
      blocks: [],
    },
  ],

  certification: {
    // Reproduced verbatim. The date fields are blank in the source.
    text:
      "This Attendance and Fining Policy, 2026, was duly adopted by the General Assembly of the Organization on the ____ day of __________________ 20____ and shall constitute the governing Penalty policies subject to the Constitution.",
    signatories: ["Chairperson", "Secretary General", "Official Seal (where applicable)"],
    adopted: false, // no date recorded — do not display an adoption date
  },
};

// --- Derived helpers -----------------------------------------------------

// Flat index for DocumentReader's in-document nav.
export const clauseIndex = attendancePolicy.clauses.map((c) => ({
  id: c.id,
  number: c.number,
  // Clause text doubles as its heading; trimmed to a nav-friendly length
  // rather than storing a separate hand-written title that could drift
  // out of sync with the clause it labels.
  title: c.text.replace(/[;:]$/, ""),
}));

// The sanctions ladder from clause 8, surfaced as structured data so
// DocumentReader can render it as a scannable escalation table — this is
// the part members actually need at a glance ("what happens on my third
// absence?"). `text` holds the verbatim provision; the other fields are
// display metadata derived from it, not new rules.
export const sanctionLadder = [
  {
    offence: "1st & 2nd",
    classification: "Minor / Moderate",
    sanction: "Written warning",
  },
  {
    offence: "3rd",
    classification: "Serious",
    sanction: "Fine of Ksh. 250",
  },
  {
    offence: "4th or more",
    classification: "Critical",
    sanction: "Suspension pending disciplinary review",
  },
];

export const getClause = (id) =>
  attendancePolicy.clauses.find((c) => c.id === id) || null;

export default attendancePolicy;