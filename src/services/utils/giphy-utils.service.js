import { giphyService } from "../api/giphy/giphy.service";

export class GiphyUtils {
  static async getTrendingGifs(setGifs, setLoading) {
    setLoading(true);
    try {
      const response = await giphyService.trending();
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  static async searchGifs(gifSearchName, setGifs, setLoading) {
    if (gifSearchName.length <= 1) {
      GiphyUtils.getTrendingGifs(setGifs, setLoading);
      return;
    }
    setLoading(true);
    try {
      const response = await giphyService.search(gifSearchName);
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
}
