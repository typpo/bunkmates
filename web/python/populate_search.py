import csv
import json
import re

def fillES(inFile, images, rooms):
  with open(inFile, 'r') as csvFile:
      csvDict = csv.DictReader(csvFile, delimiter="|")
      with open('../../expedia/HotelsFinal.json', 'w') as jsonFile:
        index = {
            "index": {
              "_index": "hotels",
              "_type": "hotel"
            }
        }
        for i,obj in enumerate(csvDict):
          id = obj['\xef\xbb\xbfEANHotelID']
          del obj['\xef\xbb\xbfEANHotelID']
          obj["id"] = id
          if id in images:
            obj["img"] = images[id]
          else :
            obj["img"] = ""
          if id in rooms:
            obj["rooms"] = rooms[id]
          else:
            obj["rooms"] = []
          index["index"]["_id"] = id
          jsonFile.write( json.dumps(index) )
          jsonFile.write('\n')
          jsonFile.write( json.dumps(obj) )
          jsonFile.write('\n')

def getRooms(inFile):
  with open(inFile, 'r') as csvFile:
      csvDict = csv.DictReader(csvFile, delimiter="|")
      rooms = {}
      print "start rooms"
      for obj in csvDict:
        eid = obj['\xef\xbb\xbfEANHotelID'];
        del obj['\xef\xbb\xbfEANHotelID']
        if not eid in rooms:
          rooms[eid] = []
        obj["RoomTypeDescription"] = re.escape(obj["RoomTypeDescription"])
        rooms[eid].append(obj)
      print "end rooms"
      return rooms

def getImages(inFile):
  with open(inFile, 'r') as csvFile:
      csvDict = csv.DictReader(csvFile, delimiter="|")
      images = {}
      print "start images"
      for obj in csvDict:
        images[obj['\xef\xbb\xbfEANHotelID']] = obj["URL"]
      print "end images"
      return images

if __name__ == "__main__":
  images = getImages('/home/ubuntu/expedia/HotelImageList.txt')
  rooms = getRooms('/home/ubuntu/expedia/RoomTypeList.txt')
  fillES('/home/ubuntu/expedia/ActivePropertyList.txt', images, rooms)
