from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Note(models.Model):
    # we write out the model definition in python. Django can automatically handle converting this into the correct database base
    # so we define the python version of our models which specify the type of fields we want to store on this model / in this data / table
    # and then django will automactially map it for us and add the correspdonign table / rows, etc in our database
    title = models.CharField(max_length=100)
    content = models.TextField() # no min or max specified - they can use as much or as little text as they want
    created_at = models.DateTimeField(auto_now_add=True) #the auto_now_add_ tells us we automatically want to populate it whenever we make a new instance of this note
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") # specifies who makes the node. We can do this with a foreign key, which can link something like a user
    # with some data that belongs to that user. In this case, we want each user to have a collection of notes and we want one user that can potntially have many different notes (one-to-many relationship)
    # then we speicfiy the on_delete - if we were to delete this user, what should we do? Models.CASCADE says we shoudl delete all of the notes that the user has
    # then as the related name, this tells us what feild name we want to put on the user that reffereences all of its notes

    def __str__(self):
        return self.title