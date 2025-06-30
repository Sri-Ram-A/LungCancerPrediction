from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import predictor
from rich import print
# Create your views here.
class Prediction(APIView):
    # def get(self, request, format=None):
    #     return Response({"Welcome to my backend"})
    
    def post(self, request):
        try:
            factors = request.data
            print("Recieved DATA")
            results = predictor.run_all_predictions(factors, request)
            return Response(results,status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({f"An error occurred: {e}"}, status=status.HTTP_400_BAD_REQUEST)