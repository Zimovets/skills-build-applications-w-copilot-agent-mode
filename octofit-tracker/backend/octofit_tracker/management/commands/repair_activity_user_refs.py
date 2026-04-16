from bson import ObjectId
from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, User


class Command(BaseCommand):
    help = "Repair Activity.user_id references that do not map to an existing User"

    def handle(self, *args, **options):
        repaired = 0
        skipped = 0
        user_map = {str(user.id): user.id for user in User.objects.all()}

        for activity in Activity.objects.all():
            user_id = getattr(activity, 'user_id', None)
            if not user_id:
                skipped += 1
                continue

            if str(user_id) in user_map:
                continue

            try:
                # Some legacy records were persisted one ObjectId step ahead.
                candidate = ObjectId(f"{int(str(user_id), 16) - 1:024x}")
            except Exception:
                skipped += 1
                continue

            if str(candidate) in user_map:
                activity.user_id = user_map[str(candidate)]
                activity.save()
                repaired += 1
            else:
                skipped += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Activity user refs repaired: {repaired}. Skipped: {skipped}."
            )
        )
