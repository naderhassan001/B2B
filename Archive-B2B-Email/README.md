This repo is for all non-careminder email campaign files.

For a new campaign cd into ./mjml and then cd into the appropriate campaign group folder.

Create a new folder (mkdir) and name it after the campaign you are about to create (use underscores for spaces).

To transpile the campaign into html run "npm run build-emails --emails={name_of_email_file}"
ex. npm run build-emails --emails=prescription_approval_request

An html file with be generated in the dist folder, the body of which can be copied into the ESP (Emarsys).

BW - 5/29/20
