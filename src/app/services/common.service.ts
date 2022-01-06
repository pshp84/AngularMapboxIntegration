import { Injectable } from '@angular/core';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getMapDatas() {
    let datas;
    var request = new XMLHttpRequest();
    request.open("GET", environment.dataUrl, false);
    request.send(null);

    if (request.status != 404) {
      datas = JSON.parse(request.responseText);
    }
    return datas;
  }
}
