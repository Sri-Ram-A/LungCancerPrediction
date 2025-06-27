from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rich import print
# Create your views here.
class Prediction(APIView):
    def get(self, request, format=None):
        return Response({"Welcome to my backend"})
    
    def post(self,request):
        print(request)
        print("data received",request.data)
        return Response({"recieved successfully"}, status=status.HTTP_201_CREATED)