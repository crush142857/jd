Mock.mock("/menu", {
  "dataSource|18": [
    {
      "key|+1": 1,
      "titles|2-4": [
        {
          name: "@cword(2,4)",
          herf: "@url('http')",
        },
      ],
      content: {
        "tabs|2-5": [
          {
            name: "@cword(2,5)",
            herf: "@url",
          },
        ],
        "subs|8-15": [
          {
            "activity|1": ["", "每300减40", "199减100"],
            category: "@cword(2,3)",
            herf: "@url",
            "items|8-20": [
              {
                herf: "@url",
                name: "@cword(2,6)",
              },
            ],
          },
        ],
      },
    },
  ],
});
Mock.mock("/hotwords", {
  "result|8-15": [
    {
      word: "@cword(2,5)",
      href: "@url(http)",
    },
  ],
});
Mock.mock("/recommendWord", {
  text: "@cword(2,5)",
});
