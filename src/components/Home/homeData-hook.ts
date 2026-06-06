import { createResource, createSignal, onMount } from "solid-js";
import { apiClient } from "~/lib/api-client";
import { HomePageData, HomePageDataResponse } from "./home-types";
import { getHomepage } from "~/lib/quiries";

export default function useHomeData() {
  const [homePageData, setHomePageData] = createSignal<HomePageData>();
  const [navbarData, setNavbarData] = createSignal();
  const [error, setError] = createSignal("");

  onMount(() => {
    fetchNavbar();
    fetchHomePageData();
  });

  const fetchHomePageData = async () => {
    try {
      const homePageDataResponse = await apiClient.get<HomePageDataResponse>(
        "/homepage?populate=*",
      );
      console.log(homePageDataResponse);
      setHomePageData(homePageDataResponse.data);
      setError("");
    } catch {
      setError("Cant fetch homepage!");
    }
  };

  const fetchNavbar = async () => {
    try {
      const navBarResponse = await apiClient.get("/navbar");
      setNavbarData(navBarResponse);
      setError("");
    } catch {
      setError("Cannot fetch /navbar");
    }
  };

  return {
    homePageData,
    fetchNavbar,
    error,
  };
}
