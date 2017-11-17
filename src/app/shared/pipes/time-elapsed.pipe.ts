import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeElapsed'
})
export class TimeElapsedPipe implements PipeTransform {

  transform(timestamp: any, args?: any): any {
    let timeSince = Date.now() - timestamp;
    // return null;
    switch(true) {
      case timeSince >= 63072000000:
        return `${Math.floor(timeSince / 31536000000)} years ago`
      case timeSince >= 31536000000:
        return "1 year ago"
      case timeSince >= 5184000000:
        return `${Math.floor(timeSince / 2592000000)} months ago`
      case timeSince >= 2592000000:
        return "1 month ago"
      case timeSince >= 1209600000:
        return `${Math.floor(timeSince / 604800000)} weeks ago`
      case timeSince >= 604800000:
        return "1 week ago"
      case timeSince >= 172800000:
        return `${Math.floor(timeSince / 86400000)} days ago`
      case timeSince >= 86400000:
        return "1 day ago"
      case timeSince >= 7200000:
        return `${Math.floor(timeSince / 3600000)} hours ago`
      case timeSince >= 3600000:
        return "1 hour ago"
      case timeSince >= 12000:
        return `${Math.floor(timeSince / 60000)} minutes ago`
      case timeSince >= 60000:
        return "1 minute ago"
      case timeSince > 0:
        return "just now"
    }
  }

}
