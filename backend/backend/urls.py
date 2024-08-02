from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # prebuilt views that allows us to create and refresh tokens

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path('api-auth/', include("rest_framework.urls")),
    path('api/', include('api.urls')), # whenevr we go to something that has api/ and it isnt one of the ones above, we're going to take the remainder of the path after the slash and fwd that to this file
    # the reason we're using two files for urls is the ones above are specific to authentication, but we don't have to do this
]
