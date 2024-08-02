from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# Create your views here.
class NoteListCreate(generics.ListCreateAPIView): # this will list all the notes that the user has created OR it will create a new note
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] # you cannot call this route unless you are authenticated and pass a valid JWT token

    #method
    def get_queryset(self):
        user = self.request.user # in django if we want to get the user that is acutally authenticated (and interacting) all we need to do in our class-nased views is write this line
        return Note.objects.filter(author=user) # we can use that user to filter our notes and just get the notes that were wirtten by this user
    
    def perform_create(self, serializer): # we pass to the serializer different data, and this will tell us if its valid or not
        # Any data thats required to create the note will be accepted passed intot he serilizer here
        # and the serizlier will check against all the different fields of the model to make sure that the data is accurate (title not above the max length, e.g., content, date, etc)
        # we're getting access to that serizlier object and we need to manually check it is valid
        if serializer.is_valid():
            # if it is valid, then we can create a new version of the note
            # we'll then save the serilzer, which will make a new versino of the note
            # and anything we pass here wil be an additional field that will add onto that note
            # so in this case we're adding the author. As, in the serializer we speicifed the author was read-only
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # here's a list of all of the different objects that we're going to be looking at when we're creating a new one (to avoid duplciations)
    serializer_class = UserSerializer # this is our serializer class that tells the above view what we need to accept to make a new user (in this case, a username and a password)
    permission_classes = [AllowAny] # this specifies who can call this, in this case we're allowing anyone to view even if they;re not authencitcaed to create a new user