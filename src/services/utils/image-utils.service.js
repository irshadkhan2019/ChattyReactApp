import { updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";

export class ImageUtils {
  static validateFile(file, type) {
    //pdf zip file and other not allowed
    if (type == "image") {
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      return file && validImageTypes.indexOf(file.type) > -1;
    } else {
      const validVideoTypes = [
        "video/m4v",
        "video/mp4",
        "video/mkv",
        "video/avi",
        "video/mpg",
        "video/webm",
      ];
      return file && validVideoTypes.indexOf(file.type) > -1;
    }
  }

  static checkFileSize(file, type) {
    let fileError = "";
    const isValid = ImageUtils.validateFile(file, type);
    if (!isValid) {
      fileError = `File ${file.name} not accepted `;
    }

    if (file.size > 100000000) {
      //100MB
      fileError = `File is too large`;
    }
    return fileError;
  }

  static checkFile(file, type) {
    const error = ImageUtils.checkFileSize(file, type);
    if (error) {
      return window.alert(error);
    }
  }

  static addFileToRedux(event, post, setSelectedFile, dispatch, type) {
    const file = event.target.files[0];
    console.log("type", type, file);
    ImageUtils.checkFile(file, type);
    setSelectedFile(file);
    dispatch(
      updatePostItem({
        image: type === "image" ? URL.createObjectURL(file) : "",
        video: type === "video" ? URL.createObjectURL(file) : "",
        gifUrl: "",
        imgId: "",
        imgVersion: "",
        videoId: "",
        videoVersion: "",
        post,
      })
    );
  }

  static readAsBase64(file) {
    const reader = new FileReader();

    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener("load", () => {
        resolve(reader.result);
      });

      reader.addEventListener("error", (event) => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }
}
