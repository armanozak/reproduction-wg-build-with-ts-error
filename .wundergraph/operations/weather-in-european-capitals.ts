import { createOperation } from "../generated/wundergraph.factory";

export default createOperation.query({
  handler: async ({ operations }) => {
    const countries = (
      await operations.query({
        operationName: "CountriesByContinent",
        input: { code: "EU" },
      })
    ).data!.countries_countries;

    const countriesWithWeather = await Promise.all(
      countries.map(({ capital, languages, ...country }) =>
        operations
          .query({
            operationName: "WeatherByCity",
            input: { cityName: capital! },
          })
          .then((weather) => ({
            ...country,
            languages: languages.map((language) => language.name),
            capital: {
              name: capital,
              ...weather.data,
            },
          }))
      )
    );

    return countriesWithWeather;
  },
});
