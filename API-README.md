# Komunikasi melalui HTTPS, menggunakan JSON
# README

## Register Image

Sample Front-end:
```
None
```

Route:
```
https://api.riset.ai/api_tablet/v1/registerimage
```

Bentuk Data JSON `Request`:

```
{
    "client_id": "Trial" // Type: String // Untuk keperluan testing, `client_id` harus di-set ke `Trial` //
    "user_id": "NIK / NIM / dsb" // Type: String // Tidak boleh meregistrasikan `user_id` yang sama lebih dari 1 kali //
    "user_name": "Nama identitas yang didaftarkan" // Type: String // 
    "user_image": "`base64 string`" // Type: String // base64 String, tanpa `header: 'data:image/png;base64'`" 
    "trx_id" : "Random Generated String" // Type: String // String dengan isi apapun, panjang di bawah 40 Characters //
    "timestamp": "yyyy-mm-dd hh:mm:ss+zz" // Type: String // Timestamp dengan format `yyyy-mm-dd hh:mm:ss+zz` //
}
```

Contoh `Request` JSON:

```
{
    "client_id": "Trial",
    "user_id": "19823897934",
    "user_name": "Budi Rahardjo",
    "user_image": "/9j/4AAQSkZJRgABAQEASABIAAD/X...",
    "trx_id": "nk7cec23-51f5-4c6e-aca5-ebd7115l8k51",
    "timestamp": "2020-05-22 12:41:26+0700"
}
```

Bentuk Data JSON `Response`:

Registration success:

```
{
	“status” : 0,
}
```

Registration Failed:

```
{
	“status” : 1,
	“error_message” : "some error message"
}
```

## Recognition

Sample Front-end:
```
http://103.89.6.76/
```

Route:
```
https://api.riset.ai/api_tablet/v1/recognizemask
```

Bentuk Data JSON `Request`:

```
{
    "client_id": "Trial" // Type: String // Untuk keperluan testing, `client_id` harus di-set ke `Trial` //
    "user_image": "`base64 string`" // Type: String // base64 String, tanpa `header: 'data:image/png;base64'`" 
    "trx_id": "Random Generated String" // Type: String // String dengan isi apapun, panjang di bawah 40 Characters //
    "timestamp": "yyyy-mm-dd hh:mm:ss+zz" // Type: String // Timestamp dengan format `yyyy-mm-dd hh:mm:ss+zz` //
}
```

Contoh `Request` JSON:

```
{
    "client_id": "Trial",
    "user_image": "/9j/4AAQSkZJRgABAQEASABIAAD/X...",
    "trx_id": "nk7cec23-51f5-4c6e-aca5-ebd7115l8k51",
    "timestamp": "2020-05-22 12:41:26+0700"
}
```

Bentuk Data JSON `Response`:

```
{
    "status": integer // jika `status` == 0, maka recognition berhasil dilakukan
    "return": [ // value dari `return` adalah `list`, tapi untuk sekarang hanya akan return 1 item, (index [0])
        {
            "confidence_level": String // angka `0.0 - 1.0`, yang menunjukkan tingkat kepastian identitas seseorang
            "user_id_rkb": String // penanda identitas yang ada di Database Recognition
            "user_name": String // nama identitas yang di daftarkan ketika registrasi
            "masker": Boolean // `true` or `false` menandakan jika orang yang difoto sedang menggunakan masker atau tidak
        }
    ]
}
```

Contoh `Response` JSON:

```
{
    "status": 0
    "return": [
        {
            "confidence_level": "0.86745"
            "user_id_rkb": "1234-5678-9101-1121"
            "user_name": "Budi Rahardjo"
            "masker": true
        }
    ]
}
```
