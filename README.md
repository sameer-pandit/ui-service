This is the ui service for image captioning service.
This provides below pages:
1. Url page: The page takes input as absoulte url of image ( url ends with the actual ext. of image) and provides caption for image.
eg: https://thumbs.dreamstime.com/x/man-standing-summer-meadow-flying-kite-19452779.jpg use this url to get the thumbnail.

2. Upload image: This page takes input as a image file which is upload to ui-service, which then passes to caption-service which returns the caption.
3. Recept Captions: This page pulls the recent images and their captions from the cache-service. (this feature is incomplete). The demo app shows only stock images from flickr.
