
// 1. ng g component uploads/upload-form
// 2. routed to the upload-form component in the app-routing.module.ts:
//     {
//         path: 'uploads',
//         component: UploadFormComponent
//     }
// 3. ng g class uploads/upload
// 4. in upload>upload.ts define the upload class
// export class Upload {
//     $key: string;
//     file:File;
//     name:string;
//     url:string;
//     progress:number;
//     createdAt: Date = new Date();
//     constructor(file:File) {
//       this.file = file;
//     }
//   }
// upload class will be used by the Service
// we are passing $key which is the key for the uploaded Image
// we are passing the file object of built in Angular File type
// the name of the photo which gets entered? where? I took this out for now
// the URL
// createdAt Date = new Date()
// a constructor that contains the file object of built in js File type. defines files that are
// passed via HTML form inputs

// *come back for user id connection and progress number*

// 5. ng g service services/upload/upload
// import * as firebase from 'firebase/app'; at the top of the service to import the Firebase API
