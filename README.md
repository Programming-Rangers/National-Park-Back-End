# National-Park-Back-End

## Database Schema

Our database is going to contain a schema composed of serveral properties obtained from the nationals parks api.  These will include the park name, park description, park website, and park location.  It was also contain data from another api endpoint which gives media information.  Then the model will inlcude a property for commentary about the park.  Finally, there will be a check mark indicating whether the park was visited.  

const ParkSchema = new Schema({
  parkName: { type: String, required: true }
  location: { type: String, required: true }
  parkWebsite: { type: String, required: true }
  parkMedia: { type: String, required: true }
  parkCommentary: {type: String, required: false }
  parkVisited: { type: Boolean, required: false }
 })
