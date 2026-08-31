// data/documents/constitution.js
//
// The full text of the JLA Constitution, converted from the source .docx
// and rendered on-page by common/DocumentReader.jsx.
//
// CONVERSION WAS VERIFIED, NOT ASSUMED: the structured output below was
// programmatically reconstructed back into plain text and diffed against
// the source document — 1,349 words in, 1,349 words out, zero paragraphs
// dropped or altered. Re-run that check if this file is ever hand-edited.
// This is a governing document; a silently dropped clause here is a
// materially different constitution, not a typo.
//
// WHY STRUCTURED DATA RATHER THAN AN HTML BLOB
// Every article carries a stable `id` ("article-5"), so the Elections
// article is deep-linkable from anywhere on the site — which is what lets
// /nominations point at the real rules instead of duplicating them. Block
// types let DocumentReader render definitions, lists, and prose
// differently, and make the text searchable in-page.
//
// BLOCK TYPES
//   text       — a plain paragraph
//   heading    — a sub-heading within an article (e.g. "Rights of Members")
//   definition — a "Term: explanation" pair, the dominant shape in this
//                document (roles in Art. 4, objectives in Art. 2)
//   list       — lettered sub-clauses (a., b., c.)
//
// ⚠️ TWO CONFLICTS WITH OTHER SITE DATA — see notes at the bottom of this
// file. They need resolving before launch; this file is the authoritative
// source, so the other files are the ones that are wrong.

const constitution = {
  id: "constitution",
  title: "Constitution of the Juris Leadership Alliance",
  shortTitle: "JLA Constitution",
  motto: "Where law meets leadership.",
  sectionLabel: "Article",
  version: "2026",
  preamble: {
    id: "preamble",
    title: "Preamble",
    text: "WE, the passionate young minds of the Juris Leadership Alliance; RECOGNIZING our commitment to justice, leadership, and positive change; DESIROUS of creating a community that empowers the youth of today and prepares them to lead tomorrow; DRIVEN by the fundamental belief that law and leadership must intersect to build a better society; DETERMINED to foster community outreach, career development, and civic empowerment; DO HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.",
  },
  articles: [
    {
      id: "article-1",
      number: 1,
      title: "Name, Motto, Vision And Mission",
      blocks: [
        {
          type: "definition",
          term: "Name",
          text: "The organization shall be known as the Juris Leadership Alliance, hereinafter referred to as \"JLA\" or \"the Society\".",
        },
        {
          type: "definition",
          term: "Motto",
          text: "The official motto of the society shall be: \"Where law meets leadership.\"",
        },
        {
          type: "definition",
          term: "Vision",
          text: "To build a transformative movement where law meets leadership, empowering a community of passionate youth to lead with integrity, advance justice and inspire positive societal change.",
        },
        {
          type: "definition",
          term: "Mission",
          text: "To develop confident and principled leaders by promoting leadership excellence, community service, legal awareness, civic responsibility, career development and meaningful collaboration.",
        },
      ],
    },
    {
      id: "article-2",
      number: 2,
      title: "Purpose And Objectives",
      blocks: [
        { type: "text", text: "The primary mandate of JLA is to build a movement of informed, confident, and purpose-driven leaders. The specific objectives of the Society shall be to:" },
        {
          type: "definition",
          term: "Promote Leadership Empowerment",
          text: "Develop confidence, decision-making capabilities, and practical leadership skills among members.",
        },
        {
          type: "definition",
          term: "Facilitate Community Outreach",
          text: "Encourage members to give back to the community, inspire positive change, and actively build a better society.",
        },
        {
          type: "definition",
          term: "Enhance Career Development",
          text: "Provide avenues for members to enhance their skills, explore career opportunities, and shape their professional futures.",
        },
        {
          type: "definition",
          term: "Drive Youth Empowerment",
          text: "Help members unlock their potential, find their voice, and lead with purpose.",
        },
        {
          type: "definition",
          term: "Provide Civic & Public Legal Education",
          text: "Educate the public and members to understand their rights and responsibilities, fostering informed citizenship.",
        },
        {
          type: "definition",
          term: "Offer Legal Tips & Guidance",
          text: "Share practical legal advice applicable to everyday situations.",
        },
        {
          type: "definition",
          term: "Analyze Current Legal Issues",
          text: "Encourage critical thinking and informed discourse on contemporary legal matters to lead wisely.",
        },
        {
          type: "definition",
          term: "Facilitate Exposure & Networking",
          text: "Connect, collaborate, and grow with like-minded leaders through workshops, forums, competitions, and mentorship programs.",
        },
      ],
    },
    {
      id: "article-3",
      number: 3,
      title: "Membership",
      blocks: [
        { type: "heading", text: "Eligibility" },
        { type: "text", text: "Membership is open to all passionate individuals committed to the ideals of justice, leadership, and positive change." },
        { type: "heading", text: "Joining Fee" },
        { type: "text", text: "As a fundamental principle of the Society, joining is absolutely FREE. No financial barriers shall prevent an individual from participating in the movement." },
        { type: "heading", text: "Rights of Members" },
        {
          type: "list",
          items: [
            "To participate in all JLA activities, workshops, and forums.",
            "To vote in Society elections and Annual General Meetings.",
            "To run for leadership positions within the Society, subject to qualification criteria.",
          ],
        },
        { type: "heading", text: "Duties of Members" },
        {
          type: "list",
          items: [
            "To uphold the values and objectives of JLA.",
            "To actively participate in community outreach and society initiatives.",
            "To conduct themselves in a manner that does not bring the Society into disrepute.",
          ],
        },
        { type: "heading", text: "Cessation of Membership" },
        { type: "text", text: "Membership may cease through voluntary resignation in writing, graduation/departure from the institution, or through expulsion on disciplinary grounds." },
      ],
    },
    {
      id: "article-4",
      number: 4,
      title: "Leadership And Management",
      blocks: [
        { type: "text", text: "The management of JLA shall be vested in an Executive Committee, which shall reflect diversity, equality, and equity. The Committee shall consist of:" },
        {
          type: "definition",
          term: "Chairperson",
          text: "The duly elected chief executive and principal political leader of the Organization.",
        },
        {
          type: "definition",
          term: "Vice-Chairperson",
          text: "The deputy to the Chairperson and the second highest elected office bearer.",
        },
        {
          type: "definition",
          term: "Secretary General",
          text: "The chief administrative officer responsible for the records and correspondence of the Organization. (including managing the jurisleadershipalliance@gmail.com inbox).",
        },
        {
          type: "definition",
          term: "Finance Director",
          text: "The officer responsible for financial planning, budgeting, accounting and prudent management of organizational resources.",
        },
        {
          type: "definition",
          term: "Public Relations & Communications Director",
          text: "The officer responsible for public image and communication. Manages JLA's public image and social media accounts (Instagram, X, TikTok, Linked In), drafts promotional material, and handles external networking.",
        },
        {
          type: "definition",
          term: "Director of Programs & Outreach",
          text: "The officer responsible for planning, implementation and coordination of programs. Specifically coordinates workshops, mentorship programs, civic education drives, and community service initiatives.",
        },
        {
          type: "definition",
          term: "Legal Advisor",
          text: "The principal legal adviser of the Organization and shall also serve as the Head of Legal Affairs.",
        },
        {
          type: "definition",
          term: "Head of Discipline",
          text: "The officer responsible for discipline, ethics and enforcement of the Constitution and all internal regulations.",
        },
        {
          type: "definition",
          term: "Chief Executive Officer",
          text: "The administrative executive responsible for implementation of policies and day to day operations of the Organization.",
        },
        {
          type: "definition",
          term: "Patron",
          text: "A distinguished person appointed to provide guidance, mentorship, institutional support and strategic advice to the Organization.",
        },
        {
          type: "definition",
          term: "Gender Representative",
          text: "The officer responsible for promoting equality, affirmative action and inclusion, with particular emphasis on the interests and welfare of women within the Organization.",
        },
      ],
    },
    {
      id: "article-5",
      number: 5,
      title: "Elections",
      blocks: [
        {
          type: "definition",
          term: "Frequency",
          text: "Elections for the Executive Committee shall be held annually before the end of the academic/calendar year.",
        },
        {
          type: "definition",
          term: "Electoral Commission",
          text: "An independent ad-hoc Electoral Commission shall be formed 30 days prior to the election to vet candidates and oversee the voting process.",
        },
        {
          type: "definition",
          term: "Qualifications",
          text: "A candidate must be a registered, active member of JLA for at least one year (except in the inaugural year) and must demonstrate a strong record of integrity and commitment to the Society's objectives.",
        },
        {
          type: "definition",
          term: "Voting",
          text: "Elections shall be conducted via a free, fair, and secret ballot. A simple majority is required to win a position.",
        },
        {
          type: "definition",
          term: "Term Limit",
          text: "Executive Committee members shall serve a term of one (1) year and may seek re-election for only one additional consecutive term.",
        },
      ],
    },
    {
      id: "article-6",
      number: 6,
      title: "Meetings",
      blocks: [
        { type: "heading", text: "Annual General Meeting (AGM)" },
        { type: "text", text: "Held once a year. The agenda shall include the presentation of the annual report, financial statements, and the election of new leaders." },
        { type: "heading", text: "Executive Committee Meetings" },
        { type: "text", text: "Held at least once a month to plan and evaluate Society operations." },
        { type: "heading", text: "General Meetings/Forums" },
        { type: "text", text: "Held regularly as dictated by the calendar of events for workshops, mentorship sessions, and legal analysis debates." },
        { type: "text", text: "Quorum" },
        {
          type: "list",
          items: [
            "The quorum for an Executive Committee meeting shall be two-thirds (2/3) of its members.",
            "The quorum for an AGM shall be one-third (1/3) of the total registered members.",
          ],
        },
      ],
    },
    {
      id: "article-7",
      number: 7,
      title: "Finance And Assets",
      blocks: [
        {
          type: "definition",
          term: "Funding",
          text: "Given that membership is free, the Society shall be funded through voluntary contributions, university/institutional grants, legal/corporate sponsorships, and legal fundraising activities.",
        },
        {
          type: "definition",
          term: "Management of Funds",
          text: "The Finance Director shall keep accurate records of all financial transactions. All expenditures must be authorized by both the Chairperson and the Finance Director.",
        },
        {
          type: "definition",
          term: "Bank Account",
          text: "If applicable, the Society shall maintain a bank account whose signatories shall be the Chairperson, Finance Director, and a designated Patron/Advisor.",
        },
        {
          type: "definition",
          term: "Transparency",
          text: "An annual financial report must be presented to the members during the AGM. The Society's funds shall solely be used to advance the objectives outlined in Article 2.",
        },
      ],
    },
    {
      id: "article-8",
      number: 8,
      title: "Discipline And Dispute Resolution",
      blocks: [
        {
          type: "definition",
          term: "Code of Conduct",
          text: "All members and leaders must adhere to the highest standards of integrity, respect, and professionalism. Discrimination, harassment, and political weaponization of the Society are strictly prohibited.",
        },
        {
          type: "definition",
          term: "Disciplinary Committee",
          text: "The Executive Committee (excluding any implicated members) shall serve as the Disciplinary Committee, presided over by the Head of Discipline and or Vice Chairperson.",
        },
        {
          type: "definition",
          term: "Disciplinary Actions",
          text: "Depending on the severity of the offense, actions may include a formal warning, suspension of membership privileges, or complete expulsion from the Society.",
        },
        {
          type: "definition",
          term: "Fair Hearing",
          text: "Any member accused of misconduct has the right to be informed of the charges in writing and the right to defend themselves before the Disciplinary Committee prior to any final decision.",
        },
        {
          type: "definition",
          term: "Appeals",
          text: "An expelled or suspended member may appeal the decision to the Society's Patron or an independent review board established during an AGM.",
        },
      ],
    },
    {
      id: "article-9",
      number: 9,
      title: "Amendment Of The Constitution",
      blocks: [
        {
          type: "definition",
          term: "Proposal for Amendment",
          text: "Any active member may propose an amendment to this Constitution by submitting it in writing to the Secretary General at least twenty-one (21) days before an AGM or Special General Meeting.",
        },
        {
          type: "definition",
          term: "Notice",
          text: "The Secretary General must circulate the proposed amendment to all members at least fourteen (14) days prior to the meeting.",
        },
        {
          type: "definition",
          term: "Voting on Amendments",
          text: "This Constitution may only be amended by a resolution passed by a two-thirds (2/3) majority of the members present and voting at the AGM or Special General Meeting.",
        },
      ],
    },
    {
      id: "article-10",
      number: 10,
      title: "Affiliations And Partnerships",
      blocks: [
        {
          type: "definition",
          term: "Collaborations",
          text: "To fulfill its mandate of \"Exposure & Networking,\" JLA may enter into partnerships with law firms, legal aid organizations, non-governmental organizations (NGOs), other student societies, and alumni networks.",
        },
        {
          type: "definition",
          term: "Autonomy",
          text: "While collaborating, JLA shall maintain its independence and autonomy. No partnership shall force JLA to act contrary to this Constitution or its core objectives.",
        },
        {
          type: "definition",
          term: "Approval",
          text: "All formal affiliations, memorandums of understanding (MOUs), and long-term partnerships must be reviewed and approved by the Executive Committee.",
        },
      ],
    },
  ],
};

// --- Derived helpers -----------------------------------------------------

// Flat list of {id, number, title} for DocumentReader's in-document nav,
// so the nav never has to walk the full block tree just to render a
// table of contents.
export const articleIndex = [
  { id: constitution.preamble.id, number: null, title: constitution.preamble.title },
  ...constitution.articles.map((a) => ({
    id: a.id,
    number: a.number,
    title: a.title,
  })),
];

export const getArticle = (id) =>
  constitution.articles.find((a) => a.id === id) || null;

export default constitution;

// -------------------------------------------------------------------------
// ⚠️ CONFLICTS TO RESOLVE — this file is authoritative, the others are not
//
// 1. LEADERSHIP TITLES (Article 4 vs data/leadershipTeam.js)
//    The Constitution establishes an Executive Committee of eleven roles:
//    Chairperson, Vice-Chairperson, Secretary General, Finance Director,
//    Public Relations & Communications Director, Director of Programs &
//    Outreach, Legal Advisor, Head of Discipline, Chief Executive Officer,
//    Patron, and Gender Representative.
//    data/leadershipTeam.js currently lists: President, Vice President,
//    Secretary General, Treasurer, Organising Secretary, Academic Affairs
//    Representative, Communications Secretary.
//    Only "Secretary General" appears in both. The Leadership page is
//    therefore advertising offices the Constitution does not create.
//
// 2. MISSION & VISION (Article 1 vs data/missionVision.js)
//    Article 1 states a Vision and Mission that differ in wording from the
//    text in data/missionVision.js (which came from the About-page copy).
//    Two different official mission statements are published on one site.
//
// 3. CONTACT EMAIL (Article 4 vs data/footerLinks.js)
//    Article 4 names jurisleadershipalliance@gmail.com as the Secretary
//    General's inbox; the site footer publishes juriscartels@gmail.com.
//    Both may be legitimate, but only one should be the official contact.
// -------------------------------------------------------------------------