import { AsyncZippable, zip } from "fflate";

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
              type: "application/zip",
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
