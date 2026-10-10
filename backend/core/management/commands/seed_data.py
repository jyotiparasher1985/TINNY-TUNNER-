"""Populate the database with the real Tiny Turners school content."""

from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import FAQ, Facility, GalleryImage, Post, Program, SiteSetting, Testimonial


class Command(BaseCommand):
    help = "Seed the database with the Tiny Turners school content."

    def handle(self, *args, **options):
        self.site_settings()
        self.programs()
        self.facilities()
        self.posts()
        self.testimonials()
        self.faqs()
        self.stdout.write(self.style.SUCCESS("\nDatabase seeded successfully."))

    # ------------------------------------------------------------------ #
    def site_settings(self):
        SiteSetting.load()
        obj = SiteSetting.load()
        obj.stats = {
            "students": "320+",
            "years": "18+",
            "teacher_ratio": "1:8",
            "activities": "25+",
        }
        obj.save()

    # ------------------------------------------------------------------ #
    def programs(self):
        rows = [
            {
                "name": "Play Group",
                "age_group": "Ages 2 - 3",
                "summary": "A gentle first step into school life through play, music and colour.",
                "details": (
                    "Our Play Group introduces young children to structure in the softest possible "
                    "way. There are no textbooks here — only songs, blocks, clay and a great deal of "
                    "curiosity. Children learn to sit, listen, share and express themselves."
                ),
                "features": "Circle time and storytelling\nSensory and art exploration\nBasic self-help skills\nFinger plays and rhymes",
            },
            {
                "name": "Nursery",
                "age_group": "Ages 3 - 4",
                "summary": "Building vocabulary, coordination and confidence through joyful activity.",
                "details": (
                    "Nursery is where independence begins. Children learn letters and sounds through "
                    "pictures and play, practise fine motor skills, and start forming friendships that "
                    "matter to them."
                ),
                "features": "Phonics and pre-reading\nNumber concepts\nFine motor activities\nSocial and emotional growth",
            },
            {
                "name": "Junior KG",
                "age_group": "Ages 4 - 5",
                "summary": "A confident step towards reading, writing and simple reasoning.",
                "details": (
                    "Junior KG balances play with purposeful learning. Our teachers introduce reading, "
                    "writing and simple maths through hands-on activities so that every concept sticks."
                ),
                "features": "Reading and writing readiness\nHands-on maths\nCreative expression\nGroup discussions and questioning",
            },
            {
                "name": "Senior KG",
                "age_group": "Ages 5 - 6",
                "summary": "School-ready learners prepared for the structured classroom ahead.",
                "details": (
                    "Senior KG is the bridge to primary school. Children consolidate their reading and "
                    "number skills, learn classroom routines, and grow the maturity to sit, work and "
                    "finish a task independently."
                ),
                "features": "Independent reading practice\nNumber operations\nClassroom routines\nEnrichment and readiness programme",
            },
            {
                "name": "Pre-Primary Bridge",
                "age_group": "Ages 6 - 7",
                "summary": "A smooth, friendly transition into the primary school wing.",
                "details": (
                    "This programme supports children who need an extra year of gentle preparation "
                    "before moving into Grade 1, with a focus on confidence, fluency and classroom comfort."
                ),
                "features": "Foundation reinforcement\nReading fluency\nClass participation\nIndividual attention",
            },
        ]
        for order, row in enumerate(rows, start=1):
            Program.objects.update_or_create(
                name=row["name"],
                defaults={**row, "order": order},
            )

    # ------------------------------------------------------------------ #
    def facilities(self):
        rows = [
            ("Safe & Secure Campus", "CCTV-covered campus, secure gated entry and trained staff on duty at all times."),
            ("Activity-Based Learning", "Art, music, dance, drama and sports woven into every single day."),
            ("Child-Safe Transport", "GPS-tracked buses, trained drivers and verified routes with a conductor."),
            ("Large Playgrounds", "Indoor and outdoor play zones with age-appropriate equipment."),
            ("Activity Room", "A dedicated space for art, crafts, clay and messy play."),
            ("Library Corner", "Picture books, story sessions and a quiet nook that children love."),
            ("Medical Room", "On-site first-aid room with a tie-up for emergencies."),
            ("Nutritious Meals", "Balanced meals and snacks planned with parents for growing bodies."),
        ]
        for order, (name, description) in enumerate(rows, start=1):
            Facility.objects.update_or_create(
                name=name, defaults={"description": description, "order": order}
            )

    # ------------------------------------------------------------------ #
    def posts(self):
        today = timezone.now()
        rows = [
            {
                "kind": Post.KIND_NOTICE,
                "title": "Admissions open for the 2026-27 session",
                "summary": "Play Group to Senior KG admissions are now open. Book a school visit this week.",
                "body": (
                    "Admissions for the 2026-27 academic session are open across all Play Way "
                    "programmes. Seats are limited for each class to keep our teacher-to-child ratio "
                    "small.\n\nYou can fill the enquiry form on this website or call the school office "
                    "to schedule a visit and meet our teachers."
                ),
                "is_featured": True,
                "published_at": today - timezone.timedelta(days=2),
            },
            {
                "kind": Post.KIND_NOTICE,
                "title": "Parent-teacher meeting schedule",
                "summary": "Termly PTM dates will be shared with parents before the end of this month.",
                "body": (
                    "Parent-teacher meetings are held once per term. A schedule card will be handed to "
                    "each child. If you need a different slot, please inform the class teacher in advance."
                ),
                "published_at": today - timezone.timedelta(days=9),
            },
            {
                "kind": Post.KIND_NOTICE,
                "title": "School closed for winter break",
                "summary": "The school will remain closed from the winter break dates. Classes resume as usual.",
                "published_at": today - timezone.timedelta(days=16),
            },
            {
                "kind": Post.KIND_NEWS,
                "title": "Tiny Turners wins the inter-school art contest",
                "summary": "Our children brought home three medals at the Panchkula inter-school art competition.",
                "body": (
                    "Thirty children from Tiny Turners took part in the district-level art competition "
                    "held at Sector 17, Panchkula. Our judges praised the originality of our students' "
                    "work and the way our teachers guide them through process rather than product.\n\n"
                    "Congratulations to every young artist who took part."
                ),
                "published_at": today - timezone.timedelta(days=5),
            },
            {
                "kind": Post.KIND_EVENT,
                "title": "Annual Sports Day",
                "summary": "A morning of races, relay games and medals for our youngest athletes.",
                "body": (
                    "Join us for our Annual Sports Day. Parents are welcome to cheer, children get to "
                    "run, jump, throw and — most importantly — take part.\n\nBuses run on all usual routes "
                    "with timings adjusted for the day."
                ),
                "event_date": (today + timezone.timedelta(days=24)).date(),
                "event_time": "9:00 AM - 1:00 PM",
                "location": "School Ground",
                "published_at": today - timezone.timedelta(days=3),
            },
            {
                "kind": Post.KIND_EVENT,
                "title": "Parent orientation for new admissions",
                "summary": "Meet our teaching team and tour the campus before classes begin.",
                "body": (
                    "All new parents are invited to an orientation session where we walk through the "
                    "daily routine, the school bus system, meal plans and what to expect in the first "
                    "few weeks."
                ),
                "event_date": (today + timezone.timedelta(days=10)).date(),
                "event_time": "11:00 AM - 12:30 PM",
                "location": "School Auditorium",
                "published_at": today - timezone.timedelta(days=1),
            },
        ]
        for row in rows:
            Post.objects.update_or_create(title=row["title"], defaults=row)

    # ------------------------------------------------------------------ #
    def testimonials(self):
        rows = [
            (
                "Meenakshi Sharma",
                "Nursery",
                "My daughter runs in every morning without a single worry. That tells me everything "
                "about how safe and happy she feels here.",
            ),
            (
                "Rajesh Kumar",
                "Play Group",
                "We came for the small class size and stayed for the teachers. Every single one of "
                "them knows our child by name.",
            ),
            (
                "Anjali Verma",
                "Junior KG",
                "The activity-based learning is genuine, not a slogan. My child comes home singing "
                "and painting, and that is exactly the point.",
            ),
            (
                "Preeti Malik",
                "Senior KG",
                "The bus staff call us if anything happens, and the teachers share photos in the "
                "class group every week. It is real communication.",
            ),
            (
                "Sandeep Rana",
                "Nursery",
                "Safe campus, clean washrooms, warm food and honest feedback on how our child is doing. "
                "We recommend Tiny Turners without hesitation.",
            ),
            (
                "Neha Bansal",
                "Play Group",
                "My son joined mid-session and the teachers made him feel at home within a week. "
                "That kind of care is rare.",
            ),
        ]
        for order, (parent, klass, quote) in enumerate(rows, start=1):
            Testimonial.objects.update_or_create(
                parent_name=parent, defaults={"child_class": klass, "quote": quote, "order": order}
            )

    # ------------------------------------------------------------------ #
    def faqs(self):
        rows = [
            (
                "What is the teacher-to-child ratio?",
                "We keep our ratios intentionally small — roughly one teacher for every eight "
                "children in Play Group, and closer to 1:15 in the senior classes. This is what lets "
                "every child get real individual attention.",
            ),
            (
                "Is transport available?",
                "Yes. We run GPS-tracked school buses across Barwala, Panchkula and nearby sectors, "
                "with a conductor on board. Routes are confirmed at the time of admission and can be "
                "adjusted as families settle in.",
            ),
            (
                "What should my child bring on the first day?",
                "A water bottle, a change of clothes, a pair of indoor shoes and a labelled napkin. "
                "We will share a detailed checklist with you at orientation.",
            ),
            (
                "Do you provide meals?",
                "We offer balanced mid-day meals and an evening snack, planned with parents for "
                "allergies and dietary preferences. Vegetarian food is the default.",
            ),
            (
                "How do I apply for admission?",
                "Fill in the enquiry form on the Admissions page or call the school office. Our team "
                "will get back to you within 24 hours to arrange a campus visit and share the fee structure.",
            ),
            (
                "What are the school timings?",
                "Monday to Friday, 8:30 AM to 1:30 PM. Optional extended hours are available until "
                "3:00 PM for working parents at an additional monthly charge.",
            ),
            (
                "Is the school affiliated?",
                "Tiny Turners is a licensed Play Way School following the early childhood framework, "
                "with a UK-aligned curriculum. We prepare children for Grade 1 in any school.",
            ),
        ]
        for order, (question, answer) in enumerate(rows, start=1):
            FAQ.objects.update_or_create(question=question, defaults={"answer": answer, "order": order})