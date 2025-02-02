import test from "tape";

import { aggregate } from "../../src";
import * as support from "../support";

support.runTest("Array Operators", {
  $arrayElemAt: [
    [[[1, 2, 3], 0], 1],
    [[[1, 2, 3], -2], 2],
    [[[1, 2, 3], 15], undefined],
  ],
  $arrayToObject: [
    [
      {
        $arrayToObject: {
          $literal: [
            { k: "item", v: "abc123" },
            { k: "qty", v: 25 },
          ],
        },
      },
      { item: "abc123", qty: 25 },
    ],
    [
      {
        $arrayToObject: {
          $literal: [
            ["item", "abc123"],
            ["qty", 25],
          ],
        },
      },
      { item: "abc123", qty: 25 },
    ],
  ],
  $concatArrays: [
    [[["hello", " "], null], null],
    [
      [["hello", " "], ["world"]],
      ["hello", " ", "world"],
    ],
    [
      [
        ["hello", " "],
        [["world"], "again"],
      ],
      ["hello", " ", ["world"], "again"],
    ],
    [
      [
        ["hello", " "],
        [["universe"], "again"],
        ["and", "bye"],
      ],
      ["hello", " ", ["universe"], "again", "and", "bye"],
    ],
  ],
  $filter: [
    [
      {
        input: [1, "a", 2, null, 3.1, 4, "5"],
        as: "num",
        cond: {
          $and: [
            { $gte: ["$$num", -9223372036854775807] },
            { $lte: ["$$num", 9223372036854775807] },
          ],
        },
      },
      [1, 2, 3.1, 4],
    ],
  ],
  $first: [
    [[1, 2, 3], 1],
    [[[]], []],
    [[null], null],
    [[], undefined],
    [null, null],
    [undefined, null],
    [5, null, { err: true }],
  ],
  $last: [
    [[1, 2, 3], 3],
    [[[]], []],
    [[null], null],
    [[], undefined],
    [null, null],
    [undefined, null],
    [5, null, { err: true }],
  ],
  $in: [
    [[2, [1, 2, 3]], true],
    [["abc", ["xyz", "abc"]], true],
    [["xy", ["xyz", "abc"]], false],
    [[["a"], ["a"]], false],
    [[["a"], [["a"]]], true],
    [[/^a/, ["a"]], false],
    [[/^a/, [/^a/]], true],
  ],
  $indexOfArray: [
    [null, null],
    [[["a", "abc"], "a"], 0],
    [[["a", "abc", "de", ["de"]], ["de"]], 3],
    [[[1, 2], 5], -1],
    [
      [
        [1, 2, 3],
        [1, 2],
      ],
      -1,
    ],
    [[[10, 9, 9, 8, 9], 9, 3], 4],
    [[["a", "abc", "b"], "b", 0, 1], -1],
    [[["a", "abc", "b"], "b", 1, 0], -1],
    [[["a", "abc", "b"], "b", 20], -1],
    [[[null, null, null], null], 0],
    [[null, "foo"], null],
    [
      ["foo", "foo"],
      "$indexOfArray expression must resolve to an array.",
      { err: true },
    ],
  ],
  $isArray: [
    [["hello"], false],
    [[["hello", "world"]], true],
  ],
  $objectToArray: [
    [
      { item: "foo", qty: 25 },
      [
        { k: "item", v: "foo" },
        { k: "qty", v: 25 },
      ],
    ],
    [
      {
        item: "foo",
        qty: 25,
        size: { len: 25, w: 10, uom: "cm" },
      },
      [
        { k: "item", v: "foo" },
        { k: "qty", v: 25 },
        { k: "size", v: { len: 25, w: 10, uom: "cm" } },
      ],
    ],
  ],
  $range: [
    [
      [0, 10, 2],
      [0, 2, 4, 6, 8],
    ],
    [
      [10, 0, -2],
      [10, 8, 6, 4, 2],
    ],
    [[0, 10, -2], []],
    [
      [0, 5],
      [0, 1, 2, 3, 4],
    ],
  ],
  $reduce: [
    [{ input: null }, null],
    [
      {
        input: ["a", "b", "c"],
        initialValue: "",
        in: { $concat: ["$$value", "$$this"] },
      },
      "abc",
    ],
    [
      {
        input: [1, 2, 3, 4],
        initialValue: { sum: 5, product: 2 },
        in: {
          sum: { $add: ["$$value.sum", "$$this"] },
          product: { $multiply: ["$$value.product", "$$this"] },
        },
      },
      { sum: 15, product: 48 },
    ],
    [
      {
        input: [
          [3, 4],
          [5, 6],
        ],
        initialValue: [1, 2],
        in: { $concatArrays: ["$$value", "$$this"] },
      },
      [1, 2, 3, 4, 5, 6],
    ],
  ],
  $reverseArray: [
    [
      [1, 2, 3],
      [3, 2, 1],
    ],
    [
      { $reverseArray: { $slice: [["foo", "bar", "baz", "qux"], 1, 2] } },
      ["baz", "bar"],
    ],
    [null, null],
    [[], []],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      [
        [4, 5, 6],
        [1, 2, 3],
      ],
    ],
  ],
  $size: [
    [["a", "b", "c"], 3],
    [[10], 1],
    [[], 0],
  ],
  $slice: [
    [[[1, 2, 3], 1, 1], [2]],
    [
      [[1, 2, 3], -2],
      [2, 3],
    ],
    [[[1, 2, 3], 15, 2], []],
    [
      [[1, 2, 3], -15, 2],
      [1, 2],
    ],
  ],
  $zip: [
    [{ inputs: [["a"], null] }, null],
    [{ inputs: [["a"], ["b"], ["c"]] }, [["a", "b", "c"]]],
    [{ inputs: [["a"], ["b", "c"]] }, [["a", "b"]]],
    [
      {
        inputs: [[1], [2, 3]],
        useLongestLength: true,
      },
      [
        [1, 2],
        [null, 3],
      ],
    ],
    // Because useLongestLength: true, $zip will pad the shorter input arrays with the corresponding defaults elements.
    [
      {
        inputs: [[1], [2, 3], [4]],
        useLongestLength: true,
        defaults: ["a", "b", "c"],
      },
      [
        [1, 2, 4],
        ["a", 3, "c"],
      ],
    ],
  ],
  $mergeObjects: [
    [[{ a: 1 }, null], { a: 1 }],
    [[null, null], {}],
    [[{ a: 1 }, { a: 2, b: 2 }, { a: 3, c: 3 }], { a: 3, b: 2, c: 3 }],
    [
      [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: null, c: 3 }],
      { a: 3, b: null, c: 3 },
    ],
  ],
});

test("Array Operators: $map", (t) => {
  // $map
  const result = aggregate(
    [
      { _id: 1, quizzes: [5, 6, 7] },
      { _id: 2, quizzes: [] },
      { _id: 3, quizzes: [3, 8, 9] },
    ],
    [
      {
        $project: {
          adjustedGrades: {
            $map: {
              input: "$quizzes",
              as: "grade",
              in: { $add: ["$$grade", 2] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, adjustedGrades: [7, 8, 9] },
      { _id: 2, adjustedGrades: [] },
      { _id: 3, adjustedGrades: [5, 10, 11] },
    ],
    result,
    "can apply $map operator"
  );
  t.end();
});

test('Array Operators: $map without "as"', (t) => {
  // $map
  const result = aggregate(
    [
      { _id: 1, quizzes: [5, 6, 7] },
      { _id: 2, quizzes: [] },
      { _id: 3, quizzes: [3, 8, 9] },
    ],
    [
      {
        $project: {
          adjustedGrades: {
            $map: {
              input: "$quizzes",
              in: { $add: ["$$this", 2] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, adjustedGrades: [7, 8, 9] },
      { _id: 2, adjustedGrades: [] },
      { _id: 3, adjustedGrades: [5, 10, 11] },
    ],
    result,
    "can apply $map operator"
  );
  t.end();
});

test("Array Operators: $map using object context", (t) => {
  // $map
  const result = aggregate(
    [
      { _id: 1, quizzes: [5, 6, 7], adjustment: 2 },
      { _id: 2, quizzes: [], adjustment: 2 },
      { _id: 3, quizzes: [3, 8, 9], adjustment: 2 },
    ],
    [
      {
        $project: {
          adjustedGrades: {
            $map: {
              input: "$quizzes",
              in: { $add: ["$$this", "$adjustment"] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, adjustedGrades: [7, 8, 9] },
      { _id: 2, adjustedGrades: [] },
      { _id: 3, adjustedGrades: [5, 10, 11] },
    ],
    result,
    "can apply $map operator"
  );
  t.end();
});

test("Array Operators: $map using frozen objects", (t) => {
  // $map
  const result = aggregate(
    [
      Object.freeze({ _id: 1, quizzes: [5, 6, 7], adjustment: 2 }),
      Object.freeze({ _id: 2, quizzes: [], adjustment: 2 }),
      Object.freeze({ _id: 3, quizzes: [3, 8, 9], adjustment: 2 }),
    ],
    [
      {
        $project: {
          adjustedGrades: {
            $map: {
              input: "$quizzes",
              in: { $add: ["$$this", "$adjustment"] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, adjustedGrades: [7, 8, 9] },
      { _id: 2, adjustedGrades: [] },
      { _id: 3, adjustedGrades: [5, 10, 11] },
    ],
    result,
    "can apply $map operator"
  );
  t.end();
});

test("Array Operators: $filter", (t) => {
  // $filter
  const result = aggregate(
    [
      { _id: 1, quizzes: [5, 6, 7] },
      { _id: 2, quizzes: [] },
      { _id: 3, quizzes: [3, 8, 9] },
    ],
    [
      {
        $project: {
          passingGrades: {
            $filter: {
              input: "$quizzes",
              as: "grade",
              cond: { $gt: ["$$grade", 5] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, passingGrades: [6, 7] },
      { _id: 2, passingGrades: [] },
      { _id: 3, passingGrades: [8, 9] },
    ],
    result,
    "can apply $filter operator"
  );
  t.end();
});

test('Array Operators: $filter without "as"', (t) => {
  // $filter
  const result = aggregate(
    [
      { _id: 1, quizzes: [5, 6, 7] },
      { _id: 2, quizzes: [] },
      { _id: 3, quizzes: [3, 8, 9] },
    ],
    [
      {
        $project: {
          passingGrades: {
            $filter: {
              input: "$quizzes",
              cond: { $gt: ["$$this", 5] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, passingGrades: [6, 7] },
      { _id: 2, passingGrades: [] },
      { _id: 3, passingGrades: [8, 9] },
    ],
    result,
    "can apply $filter operator"
  );
  t.end();
});

test("Array Operators: $filter using object context", (t) => {
  // $filter
  const result = aggregate(
    [
      { _id: 1, quizzes: [5, 6, 7], minimum: 5 },
      { _id: 2, quizzes: [], minimum: 5 },
      { _id: 3, quizzes: [3, 8, 9], minimum: 5 },
    ],
    [
      {
        $project: {
          passingGrades: {
            $filter: {
              input: "$quizzes",
              cond: { $gt: ["$$this", 5] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, passingGrades: [6, 7] },
      { _id: 2, passingGrades: [] },
      { _id: 3, passingGrades: [8, 9] },
    ],
    result,
    "can apply $filter operator"
  );
  t.end();
});

test("Array Operators: $filter using frozen objects", (t) => {
  // $filter
  const result = aggregate(
    [
      Object.freeze({ _id: 1, quizzes: [5, 6, 7], minimum: 5 }),
      Object.freeze({ _id: 2, quizzes: [], minimum: 5 }),
      Object.freeze({ _id: 3, quizzes: [3, 8, 9], minimum: 5 }),
    ],
    [
      {
        $project: {
          passingGrades: {
            $filter: {
              input: "$quizzes",
              cond: { $gt: ["$$this", 5] },
            },
          },
        },
      },
    ]
  );

  t.deepEqual(
    [
      { _id: 1, passingGrades: [6, 7] },
      { _id: 2, passingGrades: [] },
      { _id: 3, passingGrades: [8, 9] },
    ],
    result,
    "can apply $filter operator"
  );
  t.end();
});

test("more $slice examples", (t) => {
  const data = [
    {
      _id: 1,
      name: "dave123",
      favorites: ["chocolate", "cake", "butter", "apples"],
    },
    { _id: 2, name: "li", favorites: ["apples", "pudding", "pie"] },
    {
      _id: 3,
      name: "ahn",
      favorites: ["pears", "pecans", "chocolate", "cherries"],
    },
    { _id: 4, name: "ty", favorites: ["ice cream"] },
  ];

  const result = aggregate(data, [
    { $project: { name: 1, threeFavorites: { $slice: ["$favorites", 3] } } },
  ]);

  t.deepEqual(
    result,
    [
      {
        _id: 1,
        name: "dave123",
        threeFavorites: ["chocolate", "cake", "butter"],
      },
      { _id: 2, name: "li", threeFavorites: ["apples", "pudding", "pie"] },
      { _id: 3, name: "ahn", threeFavorites: ["pears", "pecans", "chocolate"] },
      { _id: 4, name: "ty", threeFavorites: ["ice cream"] },
    ],
    "can project with $slice aggregation"
  );

  t.end();
});

test("Array Operators: $arrayToObject + $objectToArray", (t) => {
  // $arrayToObject + $objectToArray
  const inventory = [
    { _id: 1, item: "ABC1", instock: { warehouse1: 2500, warehouse2: 500 } },
    { _id: 2, item: "ABC2", instock: { warehouse2: 500, warehouse3: 200 } },
  ];

  const result = aggregate(inventory, [
    { $addFields: { instock: { $objectToArray: "$instock" } } },
    {
      $addFields: {
        instock: {
          $concatArrays: [
            "$instock",
            [{ k: "total", v: { $sum: "$instock.v" } }],
          ],
        },
      },
    },
    { $addFields: { instock: { $arrayToObject: "$instock" } } },
  ]);

  t.deepEqual(
    [
      {
        _id: 1,
        item: "ABC1",
        instock: { warehouse1: 2500, warehouse2: 500, total: 3000 },
      },
      {
        _id: 2,
        item: "ABC2",
        instock: { warehouse2: 500, warehouse3: 200, total: 700 },
      },
    ],
    result,
    "can apply $objectToArray + $arrayToObject operators together"
  );
  t.end();
});

test("$concatArrays more examples", (t) => {
  const inventory = [
    { _id: 1, instock: [1, 2, 3], ordered: [4, 5, 6], shipped: [7, 8, 9] },
    { _id: 2, instock: [10] },
  ];

  const result = aggregate(inventory, [
    {
      $project: {
        ids: { $concatArrays: ["$instock", "$ordered", "$shipped"] },
      },
    },
  ]);

  t.deepEqual(
    [
      { ids: [1, 2, 3, 4, 5, 6, 7, 8, 9], _id: 1 },
      { ids: null, _id: 2 },
    ],
    result,
    "can concat more than 2 arrays using $concatArrays"
  );
  t.end();
});
