"""Seed the new editable page-content models with the existing hardcoded content."""

from django.core.management.base import BaseCommand

from core.models import (
    ApproachCard, DailyRoutine, DifferenceCard, HeroSlide, PageContent,
    SafetyItem, TeamMember, TimelineItem, TimingRow, ValueCard,
)


class Command(BaseCommand):
    help = "Seed the editable page-content models."

    def handle(self, *args, **options):
        hero = [
            ("Admissions open for 2026-27", "Where little minds turn into bright futures",
             "At Tiny Turners Play Way School, we create a safe, joyful and nurturing environment where children learn, explore, play and grow with confidence.",
             "Apply for Admission", "/admissions", "Explore our school", "/about",
             "Children running and playing on the school playground", 1),
            ("Learning through every little moment", "Growing curious, confident & kind",
             "Play-based learning, tiny hands and big imaginations. Our teachers guide every child at their own pace, in a class small enough to know them by name.",
             "See our academics", "/academics", "Visit the campus", "/facilities",
             "A teacher helping young children learn with books and building blocks", 2),
            ("A place to feel at home", "Small classes. Big care.",
             "With a 1:8 teacher ratio in our early years, your child is encouraged every day and never lost in a crowd.",
             "Why Tiny Turners", "/about", "Talk to us", "/contact",
             "Happy children drawing, painting and stacking blocks in a bright classroom", 3),
        ]
        for badge, title, lead, pl, pt, sl, st, alt, order in hero:
            HeroSlide.objects.get_or_create(title=title, defaults={
                "badge": badge, "lead": lead, "primary_label": pl, "primary_to": pt,
                "secondary_label": sl, "secondary_to": st, "image_alt": alt, "order": order,
            })

        diff = [
            ("01", "Users", "Experienced & caring teachers",
             "Every teacher is trained in early childhood and stays with the same class all year — so your child always has a familiar, trusted adult."),
            ("02", "Shield", "Safe & secure campus",
             "Gated entry, CCTV coverage, verified staff and a child-safe pickup policy. Safety is our first lesson every single day."),
            ("03", "Sparkles", "Activity-based learning",
             "Art, music, movement and play are not breaks from learning — they are how your child learns to think, solve and express."),
            ("04", "Heart", "Happy, confident children",
             "We nurture emotional growth as much as academic readiness, because a child who feels secure is a child who can flourish."),
        ]
        for num, icon, title, body in diff:
            DifferenceCard.objects.get_or_create(title=title, defaults={"num": num, "icon": icon, "body": body, "order": int(num)})

        vals = [
            ("Heart", "Child first, always", "Every decision we make — from the layout of a room to the words on a notice board — starts with what a small child needs to feel safe."),
            ("Users", "Small classes, familiar faces", "We keep ratios deliberately low so that every child is known, guided and celebrated by a consistent team of teachers."),
            ("Sparkles", "Learning through play", "Children learn best when they are curious. Our curriculum uses play, story, song and movement to build real understanding."),
            ("Shield", "Safety without compromise", "From gated entry to verified pickup, safety protocols are built into how our school runs every single day."),
        ]
        for i, (icon, title, body) in enumerate(vals, start=1):
            ValueCard.objects.get_or_create(title=title, defaults={"icon": icon, "body": body, "order": i})

        tl = [
            ("2007", "The beginning", "Tiny Turners opens its doors in Barwala, Panchkula with a handful of children and one simple idea: learn through play."),
            ("2013", "Growing families", "We expand to Nursery and Junior KG, adding a dedicated activity room and a proper library corner."),
            ("2018", "Safer campus", "Full CCTV coverage, child-safe pickup points and verified transport routes across Panchkula."),
            ("2023", "New programme wing", "Senior KG and our Pre-Primary Bridge programme open, taking children through to Grade 1 with confidence."),
            ("2026", "320+ happy learners", "Admissions open for the 2026-27 session across all Play Way programmes."),
        ]
        for i, (year, title, body) in enumerate(tl, start=1):
            TimelineItem.objects.get_or_create(title=title, defaults={"year": year, "body": body, "order": i})

        team = [
            ("Sunita Teacher", "Principal", "18 years in early childhood education."),
            ("Rakesh Verma", "Academic Coordinator", "UK-aligned curriculum design."),
            ("Anjali Rana", "Play Group Lead", "Certified in child psychology."),
        ]
        for i, (name, role, note) in enumerate(team, start=1):
            TeamMember.objects.get_or_create(name=name, defaults={"role": role, "note": note, "order": i})

        approach = [
            ("Play with a purpose", "Every activity has a learning intention behind it, but children never feel like they are being taught. The play is real; the learning is genuine."),
            ("Language through stories", "Daily storytelling, songs and conversation build vocabulary, listening skills and a genuine love of books long before formal reading begins."),
            ("Numbers through play", "Counting objects, sorting, patterns and simple games make early number sense feel natural rather than forced."),
            ("Confidence to try", "We make space for mistakes. A child who is not afraid to get something wrong is a child who keeps trying — that is real learning."),
        ]
        for i, (title, body) in enumerate(approach, start=1):
            ApproachCard.objects.get_or_create(title=title, defaults={"body": body, "order": i})

        routine = [
            ("8:30 – 9:00", "Arrival & free choice", "A calm, unhurried start with quiet activities."),
            ("9:00 – 9:40", "Circle time", "Songs, rhymes, story and the day ahead."),
            ("9:40 – 10:30", "Activity stations", "Art, blocks, clay and sensory play in small groups."),
            ("10:30 – 11:00", "Snack & outdoor play", "Fresh fruit or biscuits, then the playground."),
            ("11:00 – 12:00", "Learning blocks", "Phonics, early numbers and fine motor work."),
            ("12:00 – 12:45", "Lunch", "Balanced meal, with parents welcome to join."),
            ("12:45 – 1:30", "Story & wrap-up", "Quiet stories, sharing and goodbyes."),
        ]
        for i, (time, label, note) in enumerate(routine, start=1):
            DailyRoutine.objects.get_or_create(label=label, defaults={"time": time, "note": note, "order": i})

        safety = [
            ("Verified entry & exit", "Gated campus with sign-in, photo ID for pickup and never an unannounced visitor."),
            ("CCTV coverage", "Monitored entry points, corridors and both playgrounds."),
            ("Trained staff", "Every staff member is background-checked and trained in child safety and first aid."),
            ("Medical room", "On-site first-aid room with a tie-up hospital a few minutes away."),
            ("Child-safe transport", "GPS-tracked buses with a conductor and a verified attendant on every route."),
            ("Clean & hygienic", "Daily sanitisation, hand-wash stations and strict food-handling practice."),
        ]
        for i, (title, body) in enumerate(safety, start=1):
            SafetyItem.objects.get_or_create(title=title, defaults={"body": body, "order": i})

        timings = [
            ("8:30 AM", "School opens", "Staff on duty from 8:15 AM."),
            ("8:30 AM – 1:30 PM", "School hours", "Monday to Friday."),
            ("1:30 PM – 3:00 PM", "Extended hours", "Optional, additional monthly charge."),
            ("Saturday", "Closed", "Weekend events may be announced in advance."),
        ]
        for i, (time, label, note) in enumerate(timings, start=1):
            TimingRow.objects.get_or_create(label=label, defaults={"time": time, "note": note, "order": i})

        page = [
            ("about_story", "About page — opening story",
             "Tiny Turners began in 2007 as a single play group in Barwala. What started as a handful of children on a mat has grown into a full Play Way school — but the method has not changed."),
            ("footer_tagline", "Footer tagline", "Made for little beginnings"),
            ("cta_title", "CTA band title", "Nurturing today, inspiring tomorrow"),
        ]
        for key, label, value in page:
            PageContent.objects.get_or_create(key=key, defaults={"label": label, "value": value})

        self.stdout.write(self.style.SUCCESS("Page content seeded."))
        for name, qs in [
            ("Hero slides", HeroSlide.objects.all()),
            ("Difference cards", DifferenceCard.objects.all()),
            ("Value cards", ValueCard.objects.all()),
            ("Timeline items", TimelineItem.objects.all()),
            ("Team members", TeamMember.objects.all()),
            ("Approach cards", ApproachCard.objects.all()),
            ("Daily routine", DailyRoutine.objects.all()),
            ("Safety items", SafetyItem.objects.all()),
            ("Timing rows", TimingRow.objects.all()),
            ("Page content", PageContent.objects.all()),
        ]:
            self.stdout.write(f"  {name}: {qs.count()}")