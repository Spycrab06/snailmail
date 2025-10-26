import { getCustomerDataController } from '../controllers/getCustomerDataController.js'

export const handleGetRequest = (req, res) => {

  if ( req.url.startsWith('/getCustomerData') ) {
    return getCustomerDataController(req, res)
  } 
  // if an api call is made to a url that isn't any of the above, return 404
  else {
    res.statusCode = 404
    res.end("URL not found")
  }
}
