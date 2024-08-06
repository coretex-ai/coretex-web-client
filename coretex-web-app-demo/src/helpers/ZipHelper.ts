import { AsyncZippable, zip, gzip } from "fflate";

enum MimeTypes {
  Zip = "application/zip",
  Gzip = "application/gzip",
}

export const zipFiles = (files: File[], zipName: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const arrayBufferPromises = files.map((file) => file.arrayBuffer());

    Promise.all(arrayBufferPromises)
      .then((arrayBuffers) => {
        const zipData: AsyncZippable = {};

        for (let i = 0; i < files.length; i++) {
          zipData[files[i].name] = new Uint8Array(arrayBuffers[i]);
        }

        zip(zipData, { consume: true, mem: 0, level: 0 }, (error, data) => {
          if (error) {
            reject(error);
            return;
          } else {
            const zipFile = new File([data], zipName, {
              type: MimeTypes.Zip,
            });

            resolve(zipFile);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const gzipFile = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    file
      .arrayBuffer()
      .then((arrayBuffer) => {
        const arrayData = new Uint8Array(arrayBuffer);

        gzip(arrayData, { consume: true, mem: 0, level: 0 }, (error, data) => {
          if (error) {
            reject(error);
            return;
          } else {
            const gzipFile = new File([data], `${file.name}.gz`, {
              type: MimeTypes.Gzip,
            });

            resolve(gzipFile);
          }
        });
      })
      .catch((error) => reject(error));
  });
};
