from rest_framework import serializers
from bson import ObjectId
from .models import User, Team, Activity, Workout, Leaderboard

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team', write_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'team', 'team_id']

class ActivitySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    user_display = serializers.SerializerMethodField()

    def _user_map(self):
        if not hasattr(self, '_cached_user_map'):
            self._cached_user_map = {str(user.id): user for user in User.objects.all()}
        return self._cached_user_map

    def _safe_get_user(self, obj):
        try:
            return obj.user
        except User.DoesNotExist:
            user_id = getattr(obj, 'user_id', None)
            if not user_id:
                return None

            user = self._user_map().get(str(user_id))
            if user:
                return user

            try:
                candidate = ObjectId(f"{int(str(user_id), 16) - 1:024x}")
            except Exception:
                return None

            return self._user_map().get(str(candidate))

            return None

    def get_user(self, obj):
        user = self._safe_get_user(obj)
        if not user:
            return None

        return UserSerializer(user, context=self.context).data

    def get_user_display(self, obj):
        user = self._safe_get_user(obj)
        if user:
            if getattr(user, 'name', None):
                return user.name
            if getattr(user, 'email', None):
                return user.email

        if getattr(obj, 'user_id', None):
            return str(obj.user_id)

        return 'Unknown user'

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'user_display', 'type', 'duration', 'date']

class WorkoutSerializer(serializers.ModelSerializer):
    suggested_for = TeamSerializer(many=True, read_only=True)
    suggested_for_ids = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='suggested_for', many=True, write_only=True)
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'suggested_for', 'suggested_for_ids']

class LeaderboardSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='team', write_only=True)
    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'team_id', 'points']
