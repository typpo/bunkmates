import csv
import json

def fillES(inFile, images):
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
          jsonFile.write( json.dumps(obj) )
          jsonFile.write('\n')

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
  fillES('/home/ubuntu/expedia/ActivePropertyList.txt', images)
