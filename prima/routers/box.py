from boxsdk import Client, OAuth2

auth = OAuth2(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    access_token='DEVELOPER_TOKEN_GOES_HERE',
)

## Need to access the Box folder, make an inventory of the files and folders
## Create and record a direct download link for each file
## create a markdown record for each file, if one does not exist