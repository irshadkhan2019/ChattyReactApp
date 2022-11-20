import { updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";

export class ImageUtils {
  static validateFile(file) {
    //pdf zip file and other not allowed
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    return file && validTypes.indexOf(file.type) > -1;
  }

  static checkFileSize(file) {
    let fileError = "";
    const isValid = ImageUtils.validateFile(file);
    if (!isValid) {
      fileError = `File ${file.name} not accepted `;
    }

    if (file.size > 50000000) {
      //50MB
      fileError = `File is too large`;
    }
    return fileError;
  }

  static checkFile(file) {
    const error = ImageUtils.checkFileSize(file);
    if (error) {
      return window.alert(error);
    }
  }

  static addFileToRedux(event, post, setSelectedPostImage, dispatch) {
    const file = event.target.files[0];
    ImageUtils.checkFile(file);
    setSelectedPostImage(file);
    dispatch(
      updatePostItem({
        image: URL.createObjectURL(file),
        gifUrl: "",
        imgId: "",
        imgVersion: "",
        post,
      })
    );
  }
}
