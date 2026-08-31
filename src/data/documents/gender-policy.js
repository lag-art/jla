// data/documents/gender-policy.js
//
// The full text of the JLA Gender Equality and Prohibition of
// Discrimination Policy, converted from the source .docx and rendered
// on-page by common/DocumentReader.jsx.
// PDF: public/documents/jlagender.pdf
//
// STRUCTURALLY THE CLEANEST OF THE FOUR DOCUMENTS
// Unlike the Attendance Policy and Disciplinary Act, this one carries
// explicit "Section N: Title" headings and literal "(a)" markers in the
// text itself — no Word auto-numbering to reconstruct, and every section
// has a real title. That makes its in-document nav genuinely descriptive
// ("Protection Against Retaliation") rather than a truncated first line.
//
// TEXT IS VERBATIM, INCLUDING ERRORS
// Preserved exactly as written. Note the intro reads "serves as tool for
// prevention of any Gender inequality and probation of any kind of
// Discrimination" — "probation" appears where "prohibition" is evidently
// meant, and an article is missing before "tool". The certification also
// reads "2026,was" without a space. These are the Alliance's to correct
// in the source; publishing a silently different text than the signed
// document is not the converter's call.
//
// ⚠️ NOT ADOPTED: the certification block carries an unfilled date
// ("the ____ day of __________ 20____"), so no adoption date is shown.
//
// ⚠️ GAP WORTH ADDRESSING BEFORE PUBLICATION — no reporting route.
// This policy defines harassment (s.3), prohibits retaliation against
// complainants (s.5), and guarantees confidentiality (s.6) — but it never
// states HOW or TO WHOM a complaint is made. A person who reads this
// policy after experiencing harassment reaches the end without knowing
// what to do next, which undermines the protections it grants.
// The Disciplinary Procedure Act clause 2 provides the only route in the
// Alliance's documents ("Any member can lodge a complaint, in written
// form, through the Head of discipline"), so `reportingRoute` below
// cross-references it and is flagged as EXTERNAL to this policy — it is
// not presented as if this document said it. Adding an express reporting
// clause to the policy itself would be the real fix.

const genderPolicy = {
  id: "gender-policy",
  title: "Gender Equality and Prohibition of Discrimination Policy",
  shortTitle: "Gender Equality Policy",
  sectionLabel: "Section",
  version: "2026",

  intro:
    "This Policy serves as tool for prevention of any Gender inequality and probation of any kind of Discrimination among office bearers and member of the Juris Leadership Alliance Organization",

  sections: [
    {
      id: "section-1",
      number: 1,
      title: "Definitions",
      blocks: [
        {
          type: "definition",
          term: "Gender",
          text: "shall mean a person's actual or perceived sex, gender identity, gender expression, or sexual orientation, whether or not traditionally associated with the sex assigned at birth.",
        },
        {
          type: "definition",
          term: "Discrimination",
          text: "shall mean any distinction, exclusion, restriction, or preference based on gender that has the purpose or effect of nullifying or impairing equal treatment, opportunities, or access within the Organization.",
        },
        {
          type: "definition",
          term: "Harassment",
          text: "shall mean any unwelcome conduct, whether verbal, non-verbal, or physical, based on gender that is reasonably perceived as offensive, humiliating, or intimidating, and that interferes with a member's full participation in Organization affairs.",
        },
        {
          type: "definition",
          term: "Retaliation",
          text: "shall mean any adverse action taken against a person for reporting, investigating, or participating in proceedings under this policy.",
        },
      ],
    },
    {
      id: "section-2",
      number: 2,
      title: "Principle of Non-Discrimination",
      blocks: [
        { type: "text", text: "The Organization shall not, in any of its activities, decisions, or policies, discriminate against any person on the grounds of gender. All members and applicants for membership shall enjoy equal rights and obligations, and no gender-based criterion shall be applied to:" },
        {
          type: "list",
          numeral: "lowerLetter",
          items: [
            "Admission, renewal, or termination of membership;",
            "Eligibility for appointment to any committee, task force, or delegated body;",
            "Nomination, election, or tenure in any executive or leadership office;",
            "Access to Organization facilities, events, programs, or publications;",
            "Award of any honor, certificate, or benefit conferred by the Organization.",
          ],
        },
      ],
    },
    {
      id: "section-3",
      number: 3,
      title: "Prohibition of Gender-Based Harassment",
      blocks: [
        { type: "text", text: "No member, officer, or agent of the Organization shall engage in, condone, or facilitate gender-based harassment. Harassment shall include, but is not limited to:" },
        {
          type: "list",
          numeral: "lowerLetter",
          items: [
            "Sexually suggestive remarks, gestures, or imagery;",
            "Unwanted physical contact or advances;",
            "Derogatory or demeaning statements concerning a person's gender or gender identity;",
            "The creation of a hostile, intimidating, or offensive environment through gender-related conduct.",
          ],
        },
      ],
    },
    {
      id: "section-4",
      number: 4,
      title: "Duty to Promote Gender Inclusivity",
      blocks: [
        { type: "text", text: "The Executive Committee shall be obligated to take proactive measures to ensure gender balance and inclusivity, including:" },
        {
          type: "list",
          numeral: "lowerLetter",
          items: [
            "Using gender-neutral language in all official documents, correspondence, and resolutions;",
            "Collecting and publishing, on an annual basis, anonymized gender-disaggregated data on membership, leadership, and participation, provided such data collection complies with applicable privacy laws;",
            "Reviewing Organization policies and practices at least once per calendar year to identify and remedy any systemic gender-based disparities.",
          ],
        },
      ],
    },
    {
      id: "section-5",
      number: 5,
      title: "Protection Against Retaliation",
      blocks: [
        { type: "text", text: "No person shall be subjected to retaliation, victimization, or adverse treatment for:" },
        {
          type: "list",
          numeral: "lowerLetter",
          items: [
            "Lodging a complaint in good faith under this policy;",
            "Providing information or testimony in the course of an investigation; or",
            "Assisting in the enforcement of this policy.",
          ],
        },
      ],
    },
    {
      id: "section-6",
      number: 6,
      title: "Confidentiality",
      blocks: [
        { type: "text", text: "All proceedings, records, and communications relating to complaints under this policy shall remain confidential to the fullest extent permitted by law, except to the extent necessary to implement remedial measures or as required by legal process." },
      ],
    },
  ],

  certification: {
    // Reproduced verbatim, including the missing space in "2026,was".
    text:
      "This Policy, 2026,was duly adopted by the General Assembly of the Organization on the ____ day of __________________ 20____ and shall constitute the governing gender and discrimination policies subject to the Constitution.",
    signatories: ["Chairperson", "Secretary General", "Official Seal (where applicable)"],
    adopted: false, // no date recorded — do not display an adoption date
  },
};

// --- Derived helpers -----------------------------------------------------

// Section titles are real headings in this document, so the nav can show
// them directly rather than truncating body text as the other policies do.
export const sectionIndex = genderPolicy.sections.map((s) => ({
  id: s.id,
  number: s.number,
  title: s.title,
}));

// The four defined terms (s.1), surfaced for a glossary panel.
export const definitions = genderPolicy.sections
  .find((s) => s.number === 1)
  .blocks.filter((b) => b.type === "definition");

// Reporting route — EXTERNAL TO THIS POLICY. See the gap note in the file
// header: this document grants protections but states no reporting
// mechanism. The route below comes from the Disciplinary Procedure Act
// and is labelled as such so a reader is never told this policy says
// something it does not.
export const reportingRoute = {
  external: true,
  summary: "Complaints are lodged in writing through the Head of Discipline.",
  sourceDocument: "disciplinary-act",
  sourceClause: "Clause 2",
  note:
    "This policy does not itself specify a reporting procedure; the route above is drawn from the Disciplinary Procedure Act.",
};

export const getSection = (id) =>
  genderPolicy.sections.find((s) => s.id === id) || null;

export default genderPolicy;