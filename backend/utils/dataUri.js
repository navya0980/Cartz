import DataUriParser from 'datauri/parser.js';
import path from 'path';

const parser=new DataUriParser();

const getDataUri=(file)=>{
    //extract the extension(.png,.jpg)
    const extName=path.extname(file.originalname).toString();
    
    //converts buffer into base64
    return parser.format(extName,file.buffer).content;
}

export default getDataUri;