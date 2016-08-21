#CSV Test Project

1. Clone the code of the project.
2. Install babel globally `npm install -g babel`
3. Install all dependencies `npm install`
4. Rup the project locally `npm start`

On the homepage user can upload a csv file for analysis
On the status page user can observe dynamic memory usage for the last 2 minutes and time for analysing 15 last uploaded file.
Chart information is updating in real time via socket.

The following environment variable can be set to restrict the file loading:
CSVTEST_MAX_FILES - max count of the simultaneously loading files
CSVTEST_MAX_TIME - max time of analysing of single file
CSVTEST_MAX_MEMORY - max size of used heap
