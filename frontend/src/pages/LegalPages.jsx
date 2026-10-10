import { Link } from 'react-router-dom'
import { PageHero } from '../components/Layout'
import CtaBand from '../components/CtaBand'

/** Shared renderer for the legal pages (privacy / terms). */
export default function LegalPage({ title, lead, sections, updated }) {
  return (
    <>
      <PageHero title={title} lead={lead} breadcrumb={[title]} />

      <section className="section section--white">
        <div className="container" style={{ maxWidth: 820 }}>
          {updated && (
            <p style={{ fontSize: '0.86rem', marginBottom: 22 }}>Last updated: {updated}</p>
          )}
          <div className="prose">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 10 }}>{section.heading}</h2>
                {section.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="card" style={{ marginTop: 36 }}>
            <h3>Questions about this page?</h3>
            <p>
              Write to us and we will clarify anything you need to know.
            </p>
            <Link className="btn btn--outline" to="/contact">
              Contact the school
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Nurturing today,"
        accent="inspiring tomorrow"
        lead="Questions answered, happy children. Come and see the school for yourself."
        primary={{ label: 'Apply for admission', to: '/admissions' }}
        secondary={{ label: 'Talk to us', to: '/contact' }}
      />
    </>
  )
}

export const PRIVACY_SECTIONS = [
  {
    heading: 'What we collect',
    body: [
      'When you submit an admission enquiry we collect your child’s name, date of birth and gender, the class you are applying for, and your own name, relationship, phone number, email address and home address.',
      'We also record whether you are interested in school transport and any message you choose to write. We do not collect payment card details on this website.',
    ],
  },
  {
    heading: 'Why we collect it',
    body: [
      'This information is used only to respond to your enquiry, arrange a campus visit, prepare admission documents and keep you informed about your child’s schooling. It is never sold or shared with advertisers or third parties for marketing.',
      'If you simply send us a message through the contact form, we use your details only to reply to you.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'Admission enquiries that result in an enrolment are retained for the duration of the child’s time at the school and for the period required by applicable education record rules. Enquiries that do not result in enrolment are retained for up to 12 months, after which they are deleted.',
    ],
  },
  {
    heading: 'Photos and events',
    body: [
      'Photographs and videos taken during school activities may be used for our website, social media pages and internal displays, always with the consent of the parent or guardian.',
      'If you would prefer that your child is not photographed or named, please inform the school office in writing. We will record your preference and act on it immediately.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You may ask us at any time to confirm what personal data we hold about you or your child, to correct anything inaccurate, or to delete it where we are not required to keep it.',
      'Requests can be made by phone, email or in person at the school office and are typically answered within 15 working days.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'This website uses only essential storage to remember your navigation preferences. We do not use advertising or cross-site tracking cookies.',
    ],
  },
]

export const TERMS_SECTIONS = [
  {
    heading: 'Admission and enrolment',
    body: [
      'Admission to Tiny Turners Play Way School is confirmed only after a seat has been offered in writing and the first instalment has been received. Submitting the enquiry form on this website does not by itself secure a seat.',
      'Seats are allocated in the order of confirmed applications within each programme, subject to the age and readiness criteria applicable to that class.',
    ],
  },
  {
    heading: 'Fees',
    body: [
      'Fee schedules for each academic session are communicated to parents during the counselling call and are subject to change from year to year.',
      'Fees are payable in instalments as agreed in writing. Transport, meals and extended hours are charged separately. Late payment may result in additional fees as notified to the parent in advance.',
    ],
  },
  {
    heading: 'Attendance and conduct',
    body: [
      'Regular attendance is essential for a child’s progress. Parents are expected to notify the school office before 9:00 AM if their child will be absent, and to provide a written explanation on return.',
      'We expect children to be taught with kindness and respect. Parents and guardians are asked to model the same courtesy in all communication with the school.',
    ],
  },
  {
    heading: 'Transport',
    body: [
      'School transport is provided as a service and is subject to seat availability on the relevant route. Route allocation is confirmed in writing at the start of each term.',
      'Children must be handed to the care of the conductor at the designated stop. Parents who require a change of stop must inform the transport coordinator at least 48 hours in advance.',
    ],
  },
  {
    heading: 'Website content',
    body: [
      'Text, photographs and other material on this website are provided for general information about the school. Details relating to fees, timings and programmes are indicative and are confirmed in the formal admission offer.',
      'The school reserves the right to update or remove content on this website at any time without prior notice.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms are governed by the laws of India and are subject to the jurisdiction of the courts at Panchkula, Haryana.',
    ],
  },
]