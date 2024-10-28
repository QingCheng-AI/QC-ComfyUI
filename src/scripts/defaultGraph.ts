import type { ComfyWorkflowJSON } from '@/types/comfyWorkflow'
/** 默认的工作流Json文件 */
export const defaultGraph: ComfyWorkflowJSON | any = {
  "last_node_id": 69,
  "last_link_id": 131,
  "nodes": [
    {
      "id": 7,
      "type": "EmptyLatentImage",
      "pos": {
        "0": 1475,
        "1": 980
      },
      "size": {
        "0": 345,
        "1": 215
      },
      "flags": {},
      "order": 0,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "LATENT",
          "type": "LATENT",
          "links": [
            6
          ],
          "slot_index": 0,
          "shape": 3,
          "label": "Latent"
        }
      ],
      "properties": {
        "Node name for S&R": "EmptyLatentImage"
      },
      "widgets_values": [
        1024,
        1024,
        1
      ]
    },
    {
      "id": 69,
      "type": "VAELoader",
      "pos": {
        "0": 1010,
        "1": 1130
      },
      "size": {
        "0": 395,
        "1": 75
      },
      "flags": {},
      "order": 1,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "VAE",
          "type": "VAE",
          "links": [
            123
          ],
          "shape": 3,
          "label": "VAE"
        }
      ],
      "properties": {
        "Node name for S&R": "VAELoader"
      },
      "widgets_values": [
        "sdxl.vae.safetensors"
      ]
    },
    {
      "id": 68,
      "type": "MZ_KolorsUNETLoaderV2",
      "pos": {
        "0": 665,
        "1": 1130
      },
      "size": {
        "0": 335,
        "1": 75
      },
      "flags": {},
      "order": 2,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "model",
          "type": "MODEL",
          "links": [
            122
          ],
          "slot_index": 0,
          "shape": 3,
          "label": "模型"
        }
      ],
      "properties": {
        "Node name for S&R": "MZ_KolorsUNETLoaderV2"
      },
      "widgets_values": [
        "kolors-unet.safetensors"
      ]
    },
    {
      "id": 67,
      "type": "MZ_ChatGLM3_V2",
      "pos": {
        "0": 1010,
        "1": 730
      },
      "size": {
        "0": 400,
        "1": 200
      },
      "flags": {},
      "order": 5,
      "mode": 0,
      "inputs": [
        {
          "name": "chatglm3_model",
          "type": "CHATGLM3MODEL",
          "link": 120,
          "slot_index": 0,
          "label": "ChatGLM3"
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "links": [
            131
          ],
          "shape": 3,
          "label": "条件"
        }
      ],
      "properties": {
        "Node name for S&R": "MZ_ChatGLM3_V2"
      },
      "widgets_values": [
        "nsfw，脸部阴影，低分辨率，jpeg伪影、模糊、糟糕，黑脸，霓虹灯"
      ]
    },
    {
      "id": 66,
      "type": "MZ_ChatGLM3Loader",
      "pos": {
        "0": 662,
        "1": 877
      },
      "size": {
        "0": 335,
        "1": 60
      },
      "flags": {},
      "order": 3,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "chatglm3_model",
          "type": "CHATGLM3MODEL",
          "links": [
            118,
            120
          ],
          "shape": 3,
          "label": "ChatGLM3"
        }
      ],
      "properties": {
        "Node name for S&R": "MZ_ChatGLM3Loader"
      },
      "widgets_values": [
        "chatglm3-fp16.safetensors"
      ]
    },
    {
      "id": 65,
      "type": "MZ_ChatGLM3_Advance_V2",
      "pos": {
        "0": 987,
        "1": 403
      },
      "size": {
        "0": 400,
        "1": 220
      },
      "flags": {},
      "order": 4,
      "mode": 0,
      "inputs": [
        {
          "name": "chatglm3_model",
          "type": "CHATGLM3MODEL",
          "link": 118,
          "slot_index": 0,
          "label": "ChatGLM3"
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "links": [
            130
          ],
          "slot_index": 0,
          "shape": 3,
          "label": "条件"
        }
      ],
      "properties": {
        "Node name for S&R": "MZ_ChatGLM3_Advance_V2"
      },
      "widgets_values": [
        "新海诚风格，丰富的色彩，穿着彩色皮衣的女孩站在田野里，背后是盛开的向日葵，蝴蝶飞过，唯美风景，清新明亮，斑驳的光影，最好的质量，超细节，8K画质。",
        1024,
        1024,
        0,
        0,
        1024,
        1024
      ]
    },
    {
      "id": 5,
      "type": "KSampler",
      "pos": {
        "0": 1850,
        "1": 730
      },
      "size": {
        "0": 315,
        "1": 475
      },
      "flags": {},
      "order": 6,
      "mode": 0,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 122,
          "slot_index": 0,
          "label": "模型"
        },
        {
          "name": "positive",
          "type": "CONDITIONING",
          "link": 130,
          "label": "正面条件"
        },
        {
          "name": "negative",
          "type": "CONDITIONING",
          "link": 131,
          "slot_index": 2,
          "label": "负面条件"
        },
        {
          "name": "latent_image",
          "type": "LATENT",
          "link": 6,
          "slot_index": 3,
          "label": "Latent"
        }
      ],
      "outputs": [
        {
          "name": "LATENT",
          "type": "LATENT",
          "links": [
            8
          ],
          "slot_index": 0,
          "shape": 3,
          "label": "Latent"
        }
      ],
      "properties": {
        "Node name for S&R": "KSampler"
      },
      "widgets_values": [
        583826210246186,
        "randomize",
        25,
        4.54,
        "euler",
        "ddim_uniform",
        1
      ]
    },
    {
      "id": 11,
      "type": "PreviewImage",
      "pos": {
        "0": 2219,
        "1": 876
      },
      "size": {
        "0": 220,
        "1": 375
      },
      "flags": {},
      "order": 8,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 10,
          "label": "图像"
        }
      ],
      "outputs": [],
      "properties": {
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 9,
      "type": "VAEDecode",
      "pos": {
        "0": 2220,
        "1": 521
      },
      "size": {
        "0": 220,
        "1": 50
      },
      "flags": {},
      "order": 7,
      "mode": 0,
      "inputs": [
        {
          "name": "samples",
          "type": "LATENT",
          "link": 8,
          "label": "Latent"
        },
        {
          "name": "vae",
          "type": "VAE",
          "link": 123,
          "slot_index": 1,
          "label": "VAE"
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "links": [
            10
          ],
          "slot_index": 0,
          "shape": 3,
          "label": "图像"
        }
      ],
      "properties": {
        "Node name for S&R": "VAEDecode"
      },
      "widgets_values": []
    }
  ],
  "links": [
    [
      6,
      7,
      0,
      5,
      3,
      "LATENT"
    ],
    [
      8,
      5,
      0,
      9,
      0,
      "LATENT"
    ],
    [
      10,
      9,
      0,
      11,
      0,
      "IMAGE"
    ],
    [
      118,
      66,
      0,
      65,
      0,
      "CHATGLM3MODEL"
    ],
    [
      120,
      66,
      0,
      67,
      0,
      "CHATGLM3MODEL"
    ],
    [
      122,
      68,
      0,
      5,
      0,
      "MODEL"
    ],
    [
      123,
      69,
      0,
      9,
      1,
      "VAE"
    ],
    [
      130,
      65,
      0,
      5,
      1,
      "CONDITIONING"
    ],
    [
      131,
      67,
      0,
      5,
      2,
      "CONDITIONING"
    ]
  ],
  "groups": [],
  "config": {},
  "extra": {
    "ds": {
      "scale": 0.8264462809917354,
      "offset": [
        -1396.3767872924318,
        -291.0958653538071
      ]
    },
    "workspace_info": {
      "id": "ckS1tBu-IMHBxD8SZ6K-k",
      "saveLock": false,
      "cloudID": null,
      "coverMediaPath": null
    }
  },
  "version": 0.4
}


// {
//   last_node_id: 9,
//   last_link_id: 9,
//   nodes: [
//     {
//       id: 7,
//       type: 'CLIPTextEncode',
//       pos: [413, 389],
//       size: [425.27801513671875, 180.6060791015625],
//       flags: {},
//       order: 3,
//       mode: 0,
//       inputs: [{ name: 'clip', type: 'CLIP', link: 5 }],
//       outputs: [
//         {
//           name: 'CONDITIONING',
//           type: 'CONDITIONING',
//           links: [6],
//           slot_index: 0
//         }
//       ],
//       properties: {},
//       widgets_values: ['text, watermark']
//     },
//     {
//       id: 6,
//       type: 'CLIPTextEncode',
//       pos: [415, 186],
//       size: [422.84503173828125, 164.31304931640625],
//       flags: {},
//       order: 2,
//       mode: 0,
//       inputs: [{ name: 'clip', type: 'CLIP', link: 3 }],
//       outputs: [
//         {
//           name: 'CONDITIONING',
//           type: 'CONDITIONING',
//           links: [4],
//           slot_index: 0
//         }
//       ],
//       properties: {},
//       widgets_values: [
//         'beautiful scenery nature glass bottle landscape, , purple galaxy bottle,'
//       ]
//     },
//     {
//       id: 5,
//       type: 'EmptyLatentImage',
//       pos: [473, 609],
//       size: [315, 106],
//       flags: {},
//       order: 1,
//       mode: 0,
//       outputs: [{ name: 'LATENT', type: 'LATENT', links: [2], slot_index: 0 }],
//       properties: {},
//       widgets_values: [512, 512, 1]
//     },
//     {
//       id: 3,
//       type: 'KSampler',
//       pos: [863, 186],
//       size: [315, 262],
//       flags: {},
//       order: 4,
//       mode: 0,
//       inputs: [
//         { name: 'model', type: 'MODEL', link: 1 },
//         { name: 'positive', type: 'CONDITIONING', link: 4 },
//         { name: 'negative', type: 'CONDITIONING', link: 6 },
//         { name: 'latent_image', type: 'LATENT', link: 2 }
//       ],
//       outputs: [{ name: 'LATENT', type: 'LATENT', links: [7], slot_index: 0 }],
//       properties: {},
//       widgets_values: [156680208700286, true, 20, 8, 'euler', 'normal', 1]
//     },
//     {
//       id: 8,
//       type: 'VAEDecode',
//       pos: [1209, 188],
//       size: [210, 46],
//       flags: {},
//       order: 5,
//       mode: 0,
//       inputs: [
//         { name: 'samples', type: 'LATENT', link: 7 },
//         { name: 'vae', type: 'VAE', link: 8 }
//       ],
//       outputs: [{ name: 'IMAGE', type: 'IMAGE', links: [9], slot_index: 0 }],
//       properties: {}
//     },
//     {
//       id: 9,
//       type: 'SaveImage',
//       pos: [1451, 189],
//       size: [210, 26],
//       flags: {},
//       order: 6,
//       mode: 0,
//       inputs: [{ name: 'images', type: 'IMAGE', link: 9 }],
//       properties: {}
//     },
//     {
//       id: 4,
//       type: 'CheckpointLoaderSimple',
//       pos: [26, 474],
//       size: [315, 98],
//       flags: {},
//       order: 0,
//       mode: 0,
//       outputs: [
//         { name: 'MODEL', type: 'MODEL', links: [1], slot_index: 0 },
//         { name: 'CLIP', type: 'CLIP', links: [3, 5], slot_index: 1 },
//         { name: 'VAE', type: 'VAE', links: [8], slot_index: 2 }
//       ],
//       properties: {},
//       widgets_values: ['v1-5-pruned-emaonly.ckpt']
//     }
//   ],
//   links: [
//     [1, 4, 0, 3, 0, 'MODEL'],
//     [2, 5, 0, 3, 3, 'LATENT'],
//     [3, 4, 1, 6, 0, 'CLIP'],
//     [4, 6, 0, 3, 1, 'CONDITIONING'],
//     [5, 4, 1, 7, 0, 'CLIP'],
//     [6, 7, 0, 3, 2, 'CONDITIONING'],
//     [7, 3, 0, 8, 0, 'LATENT'],
//     [8, 4, 2, 8, 1, 'VAE'],
//     [9, 8, 0, 9, 0, 'IMAGE']
//   ],
//   groups: [],
//   config: {},
//   extra: {},
//   version: 0.4
// }
