import csv
import json
from pyes import *

def setupES(delete=False):
  conn = ES('bunkmates.co:9200')
  conn.indices.create_index_if_missing('hotels')
  return conn

def fillES(inFile, images, conn):
  with open(inFile, 'r') as csvFile:
      csvDict = csv.DictReader(csvFile, delimiter="|")
      """
      for o in csvDict:
        mapping = {}
        for type in o:
          print type
          mapping[type] = {
            'boost': 1.0,
            'index': 'analyzed',
            'store': 'yes',
            'type': 'string',
            'term_vector': 'with_positions_offsets'
          }
        print mapping
        conn.indices.put_mapping('hotel', {'properties':mapping}, ['hotels'])
        break
      """
      with open('../../expedia/Hotels.json', 'w') as jsonFile:
        hotels = []
        for i,obj in enumerate(csvDict):
          id = obj['\xef\xbb\xbfEANHotelID']
          del obj['\xef\xbb\xbfEANHotelID']
          obj["id"] = id
          if id in images:
            obj["img"] = images[id]
          else :
            obj["img"] = ""
          hotels.append(obj)
          jsonFile.write( json.dumps(obj) );

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
  conn = setupES()
  images = getImages('../../expedia/HotelImageList.txt')
  fillES('../../expedia/ActivePropertyList.txt', images, conn)
