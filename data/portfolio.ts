import {
  Binary,
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Database,
  Eye,
  GraduationCap,
  Gamepad2,
  HeartPulse,
  MessageSquareText,
  Workflow
} from "lucide-react";

export const projectIcons = {
  game: Gamepad2,
  analytics: ChartNoAxesCombined,
  vision: Eye,
  symbols: Binary,
  healthcare: HeartPulse,
  nlp: MessageSquareText
};

export type ProjectFigure = {
  src: string;
  title: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type Project = {
  id?: string;
  slug?: string;
  title: string;
  summary: string;
  description?: string;
  long_description?: string;
  year?: string;
  category?: string;
  cover_image?: string;
  gallery_images?: string[];
  figures?: ProjectFigure[];
  video?: { src: string; poster: string; title: string; description: string };
  project_url?: string;
  featured?: boolean;
  visible?: boolean;
  sort_order?: number;
  techStack: string[];
  tags: string[];
  icon: keyof typeof projectIcons;
  caseStudy: {
    problem: string;
    dataset: string;
    approach: string;
    models: string;
    evaluation: string;
    results: string;
    prototype?: string;
    verification?: string;
    gameplay?: string;
    contribution?: string;
    credits?: string;
    learned: string;
    limitations?: string;
  };
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" }
];

export const projects: Project[] = [
  {
    title: "CricSee: T20 Cricket Analytics",
    slug: "t20-cricket-win-probability-net-win-contribution",
    summary:
      "Developed CricSee for match replay, win-probability analysis and player contributions, supported by research on 1,521 T20I matches.",
    long_description:
      "An interactive T20 cricket prototype connecting match replay, estimated win probabilities and partial Net Win Contribution (NWC). Built with React, TypeScript and FastAPI, with player histories, data uploads, exports and match-grounded AI Q&A.",
    year: "2026",
    category: "Sports Analytics / Research Project",
    featured: true,
    visible: true,
    sort_order: 0,
    techStack: ["Python", "Pandas", "Scikit-learn", "XGBoost", "React", "TypeScript", "FastAPI", "SQLite", "OpenAI API"],
    tags: ["Research Project", "Sports Analytics", "Win Probability", "Player Contributions", "Chronological Validation", "Interactive Prototype"],
    figures: [
      {
        src: "/projects/cricsee/recorded-event-replay.webp",
        title: "Recorded-event replay",
        alt: "CricSee replay interface with the selected South Africa-Pakistan match, score, win probability, partial contribution values and event playback controls.",
        caption: "The replay keeps the selected event, score, estimated win probability and interval-level player allocations together. This is recorded-match analysis, not a live match feed.",
        width: 2160,
        height: 1500
      },
      {
        src: "/projects/cricsee/linked-match-dashboard.webp",
        title: "Linked match dashboard",
        alt: "CricSee dashboard showing a scoring rhythm diagram, complementary team win-probability curves and player contribution bars.",
        caption: "The retrospective dashboard links scoring rhythm, the full probability path, the selected event and partial player totals. Missing allocations remain distinct from zero.",
        width: 2040,
        height: 1952
      },
      {
        src: "/projects/cricsee/player-history.webp",
        title: "Player history and filters",
        alt: "DA Miller's date-filtered CricSee history with batting statistics, contribution coverage and a separate unavailable bowling record.",
        caption: "Player histories connect filtered matches with batting/bowling records, contribution coverage and replay links. Unavailable bowling values are not shown as measured zeros.",
        width: 2040,
        height: 1505
      },
      {
        src: "/projects/cricsee/resource-comparison.webp",
        title: "Did player resources improve prediction?",
        alt: "Comparison of combined resource features against the state-and-team baseline, with all four Log Loss gain confidence intervals crossing zero.",
        caption: "All four primary 95% intervals cross zero in the test comparison. The proposed resource features did not demonstrate a consistent predictive advantage.",
        width: 1800,
        height: 780
      },
      {
        src: "/projects/cricsee/system-architecture.webp",
        title: "CricSee system architecture",
        alt: "CricSee architecture connecting the React and TypeScript interface, FastAPI services, separate data stores and analytical workers.",
        caption: "Match views and replay connect to FastAPI services, versioned research exports, a Cricsheet library, uploads and analytical workers. Original architecture figure from the final report.",
        width: 1378,
        height: 1001
      }
    ],
    icon: "vision",
    caseStudy: {
      problem:
        "Test whether remaining batting and bowling resources improve win-probability estimates, then make the estimates and partial player contributions inspectable alongside recorded match events.",
      dataset:
        "Retained 1,521 eligible men's and women's T20I matches and 360,721 delivery events from 5,602 source matches. Chronological splits contain 1,065 training, 228 validation and 228 test matches. Research records remain separate from library updates and uploads.",
      approach:
        "Built pre-delivery features and strictly prior-date histories, then compared eight feature groups across four gender/innings subsets. Eligible probability changes are allocated to striker/bowler pairs; unsupported events and innings-boundary changes remain team residuals.",
      models:
        "Compared Logistic Regression, Random Forest, HistGradientBoosting and XGBoost: 336 fitted candidates plus four constant baselines. Validation Log Loss selected one frozen configuration per subset, without refitting on combined training and validation data.",
      evaluation:
        "Assessed Log Loss, Brier Score, AUC and calibration. Used 2,000 paired whole-match bootstrap draws for resource comparisons, plus permutation importance and contribution-ledger reconciliation. Terminal adjustments are kept visible separately.",
      results:
        "Resources showed no consistent test improvement; all four primary 95% intervals crossed zero. Selected-model Log Loss was 0.55663 / 0.33473 for women's first / second innings and 0.59701 / 0.36335 for men's. NWC allocated 48,469 of 53,850 test intervals (90.01%); 5,381 remained residuals, with closure error around 3.9e-16.",
      verification:
        "Passed 341 automated cases: 141 frontend and 200 backend tests. Browser checks covered event synchronisation, filtered histories and CSV/JSON exports. Six single-run questions checked selected AI behaviours, not general answer accuracy.",
      learned: "",
      limitations:
        "The test cohort was inspected during development, so comparisons are exploratory rather than an untouched confirmation. NWC is partial and model-dependent, not causal; terminal closure can dominate totals. The prototype replays recorded matches, not a live feed. User studies, load testing and broader AI evaluation remain future work."
    }
  },
  {
    title: "Australian Trade & Petroleum Analytics",
    slug: "australian-trade-petroleum-analytics",
    summary:
      "Built Excel-to-Tableau dashboards explaining Australian trade patterns, petroleum deficits and the uncertainty of a five-year import outlook.",
    long_description:
      "A visual analytics course project tracing Australian trade from national categories to petroleum imports and exports. Prepared data in Excel, built Tableau dashboards and a six-point Story, and checked forecasts against a simple baseline rather than presenting projections as certain outcomes.",
    year: "2026",
    category: "Data Analytics / BI",
    techStack: ["Excel", "Tableau", "Data Preparation", "Data Visualisation", "Forecast Evaluation"],
    tags: ["Course Project", "Excel", "Tableau", "Dashboard Design", "Forecast Evaluation"],
    icon: "analytics",
    figures: [
      {
        src: "/projects/australian-trade/petroleum-dashboard.webp",
        title: "Petroleum trade dashboard",
        alt: "Original Tableau dashboard with petroleum import/export values, trade deficits, annual growth and indexed growth from 2016 to 2025.",
        caption: "Four coordinated views separate trade levels, deficits, annual changes and relative growth. Values retain the supplied dataset's '$ millions' unit; the two initial YoY values are unavailable, not zero.",
        width: 2200,
        height: 1520
      },
      {
        src: "/projects/australian-trade/forecast-interval.webp",
        title: "Forecast and uncertainty",
        alt: "Native Tableau petroleum import forecast showing the 2016-2025 history, flat 2026-2030 forecast and widening 95 percent prediction interval.",
        caption: "The native Tableau forecast retains its widening 95% prediction band. It uses only ten annual observations and carries a Poor quality label in the workbook; a flat centre does not imply a stable outlook.",
        width: 1665,
        height: 550
      },
      {
        src: "/projects/australian-trade/policy-story.webp",
        title: "From analysis to a monitoring reference",
        alt: "Final Tableau Story point comparing the Tableau forecast, a recursive three-year moving-average forecast and the proposed 2025-based reference through 2030.",
        caption: "The final point in a six-part Tableau Story compares forecasts with a 2025-based monitoring reference. Gaps from the reference are not estimated policy savings or a government commitment.",
        width: 2200,
        height: 1310
      }
    ],
    caseStudy: {
      problem:
        "Investigate why an overall mineral-fuel trade surplus can coexist with a persistent petroleum deficit, and communicate the finding without confusing expenditure, physical demand and business profit.",
      dataset:
        "Used course-supplied 2016-2025 import and export data: 10 main categories, 67 subcategories and totals, reshaped into 1,560 records. Hierarchy levels stay separate to prevent double-counting. Original units and aggregation discrepancies are retained.",
      approach:
        "Prepared shares, year-on-year growth, trade balances, indexed growth and summary statistics in Excel. Built 19 Tableau worksheets, four main dashboards and a six-point Story connecting national structure, mineral fuels, petroleum and forecast uncertainty.",
      models:
        "Compared Tableau's native level-only exponential smoothing with a recursive three-year moving average proposed by ChatGPT and an unchanged-value baseline. The moving-average calculation is reproduced explicitly in Excel.",
      evaluation:
        "At a fixed 2023 origin, forecast 2024 and 2025 without updating with the first test actual. Checked absolute errors and MAE separately from native fitted diagnostics. The AI method was selected after seeing the full history, so this is retrospective validation.",
      results:
        "The 2025 fuel surplus was 86,923 while petroleum's deficit was 38,555, in the supplied '$ millions' unit. Two-year holdout MAE was 1,720.5 for Tableau, 4,890 for the moving average and 5,594.5 for the unchanged-value baseline. This limited test favours Tableau, not a general superiority claim.",
      learned: "",
      limitations:
        "Ten annual observations and two holdout years limit forecasting evidence. Native forecast quality is Poor. Nominal trade values do not establish physical dependence, causal drivers or policy savings; currency and calendar/fiscal coverage are not explicitly confirmed in the teaching file."
    }
  },
  {
    title: "Wimbledon Finals & Player Performance",
    slug: "wimbledon-finals-player-performance",
    summary:
      "Cleaned historical championship records and built Tableau views comparing title concentration, match characteristics and player performance.",
    long_description:
      "A visual analytics course project exploring Wimbledon championship records through three Tableau dashboards. Excel preparation separates match-level and player-level data, while the visual analysis compares countries, match characteristics and different definitions of player success.",
    year: "2026",
    category: "Data Analytics / Visualisation",
    techStack: ["Excel", "Tableau", "Data Cleaning", "Data Modelling", "Visual Analytics"],
    tags: ["Course Project", "Excel", "Tableau", "Visual Analytics", "Sports Analytics"],
    icon: "analytics",
    figures: [
      {
        src: "/projects/wimbledon/titles-by-country-player.webp",
        title: "Where titles are concentrated",
        alt: "Original Tableau treemap grouping Wimbledon title records by country and player, with rectangle area proportional to the title count.",
        caption: "Rectangle area represents title count for each country-player combination in the supplied dataset. Historical country labels are retained; small rectangles rely on tooltips in the original Tableau workbook.",
        width: 1482,
        height: 1187
      },
      {
        src: "/projects/wimbledon/player-profiles.webp",
        title: "Four measures, different player profiles",
        alt: "Tableau parallel coordinates comparing 17 five-title players across scaled title counts, final title conversion, aggregate game win share and straight-set title share.",
        caption: "The 17 five-title players are compared across titles scaled by nine, final conversion, pooled game win share and straight-set title share. Blue indicates men and orange women. No combined ranking is calculated.",
        width: 1807,
        height: 1155
      },
      {
        src: "/projects/wimbledon/player-game-share.webp",
        title: "Game win share across winning and losing finals",
        alt: "Tableau dot plot comparing aggregate game win share for six men's and eleven women's players with at least five titles in the supplied dataset.",
        caption: "Game win share pools games from both won and lost eligible finals, rather than averaging match percentages. It is distinct from title count, final conversion and career match win rate.",
        width: 1063,
        height: 821
      },
      {
        src: "/projects/wimbledon/duration-and-games.webp",
        title: "Match length and missing-data coverage",
        alt: "Scatter plot of 209 score- and duration-eligible Wimbledon finals, with total games on the horizontal axis and recorded minutes on the vertical axis.",
        caption: "Each point is a final with eligible scores and a known duration. Blue indicates men and orange women. The association between games and minutes is descriptive; formats and uneven historical coverage limit comparisons.",
        width: 1198,
        height: 1180
      }
    ],
    caseStudy: {
      problem:
        "Compare historical title patterns and player performance without treating title count, final conversion and the proportion of games won as interchangeable measures.",
      dataset:
        "Prepared 271 championship records from the supplied 1877-2026 teaching dataset: 139 men's and 132 women's records. Separate tables hold 542 finalist appearances and 210 reconciled player identities. Score analysis uses 268 eligible finals; 209 completed matches have recorded durations.",
      approach:
        "Reconciled player names, corrected four score inconsistencies and documented disputed or incomplete records. Kept unplayed sets and missing minutes distinct from genuine zeros. Built 11 Tableau worksheets and three dashboards for countries/history, top-player profiles and match analysis.",
      models: "",
      evaluation:
        "Defined the population and denominator for each measure before comparison. Higher-seed analysis uses 165 completed finals with valid unequal seeds. Player game share pools games across eligible appearances; the five-title cohort contains 17 players. Tableau filters and a Match ID action connect overview charts to individual records.",
      results:
        "In this dataset, the United States, United Kingdom and Australia account for 190 of 271 titles (70.1%). Higher-seeded finalists won 115 of 165 eligible finals (69.7%). Title count and game-share measures identify different leaders, supporting multi-metric comparisons rather than a single best-player score.",
      learned: "",
      limitations:
        "Findings describe the supplied dataset, not a fully audited historical archive. Some recent records and original durations remain unverified; duration coverage is uneven. Changing scoring rules, historical rounds and match formats prevent causal interpretations or simple claims about player ability. Static images do not reproduce the original workbook's filters and tooltips."
    }
  },
  {
    title: "Deep Learning for Image Classification & Object Detection",
    summary:
      "Developed four PyTorch computer-vision experiments across 10-class image classification and object detection; a customized ResNet18 reached 92.43% test accuracy and SSD300 achieved 90.50% detection accuracy at IoU 0.5.",
    long_description:
      "A comparative deep-learning study covering transfer learning, architectural customization, regularization, and early stopping across image classification and object detection. The work evaluated a baseline ResNet18, a deeper customized variant, Faster R-CNN, and SSD300 using reproducible data splits and visual training diagnostics.",
    year: "2026",
    category: "Computer Vision / Deep Learning",
    gallery_images: [
      "/projects/deep-learning-classification-samples.png",
      "/projects/deep-learning-customized-cnn-curves.png",
      "/projects/deep-learning-detection-sample.png",
      "/projects/deep-learning-ssd300-loss.png"
    ],
    techStack: ["Python", "PyTorch", "TorchVision", "ResNet18", "Faster R-CNN", "SSD300"],
    tags: ["Computer Vision", "Deep Learning", "Transfer Learning", "Object Detection"],
    icon: "vision",
    caseStudy: {
      problem:
        "Build and compare reliable CNN workflows for multi-class image classification and object localization, then test whether architectural customization improves generalization on limited datasets.",
      dataset:
        "The classification dataset contains 10 dog-breed classes and was split 70%/15%/15% for training, validation, and testing using a fixed student-ID seed. Images were resized to 224 x 224 and normalized with ImageNet statistics. The detection dataset was pre-split and supplied in Pascal VOC, COCO, and YOLO formats; Pascal VOC annotations were used for the experiments.",
      approach:
        "Fine-tuned an ImageNet-pretrained ResNet18, then added a 512-channel convolutional block with batch normalization, ReLU, and 0.5 dropout for the customized classifier. For detection, adapted pretrained Faster R-CNN and SSD300 prediction heads to the dataset classes, trained with SGD, monitored validation loss, and saved the best checkpoint with early stopping.",
      models:
        "Baseline ResNet18 and a customized ResNet18 for 10-class classification; Faster R-CNN and SSD300 for object detection. Classification used Adam and CrossEntropyLoss, while both detectors used SGD with momentum 0.9 and weight decay 0.0005.",
      evaluation:
        "Compared classification test accuracy, detection accuracy at IoU = 0.5, training and validation loss curves, convergence behavior, and early-stopping epochs. Sample class images and annotated bounding boxes were also reviewed visually.",
      results:
        "The customized classifier improved test accuracy from 75.30% for baseline ResNet18 to 92.43%. For detection, SSD300 reached 90.50% accuracy at IoU = 0.5 and stopped at epoch 42, outperforming Faster R-CNN at 73.47%, which stopped at epoch 74. SSD300 also converged faster and maintained more stable validation loss on this dataset.",
      learned:
        "Transfer learning provided a strong starting point, but architecture changes and regularization materially improved classification generalization. The detector comparison also showed that a simpler single-stage model can outperform a two-stage pipeline when its speed and optimization behavior better match the dataset."
    }
  },
  {
    title: "Handwritten Mathematical Symbol Recognition",
    summary:
      "Compared HOG, LBP, and raw-pixel representations across RBF-SVM and MLP classifiers for 10 handwritten symbol classes; HOG with SVM achieved 99.3% test accuracy.",
    long_description:
      "A controlled computer-vision experiment examining how feature representation changes multi-class recognition performance. The same balanced handwritten-symbol dataset was evaluated with classical and neural classifiers using raw pixels, HOG shape descriptors, and LBP texture features.",
    year: "2026",
    category: "Computer Vision / Machine Learning",
    gallery_images: [
      "/projects/handwritten-model-comparison.png",
      "/projects/handwritten-svm-hog-confusion-matrix.png",
      "/projects/handwritten-sample-predictions.png"
    ],
    techStack: ["Python", "Scikit-learn", "HOG", "LBP", "SVM", "MLP"],
    tags: ["Computer Vision", "Feature Engineering", "SVM", "Neural Networks"],
    icon: "symbols",
    caseStudy: {
      problem:
        "Classify handwritten mathematical symbols despite writer-to-writer variation and visually similar stroke patterns, while determining which feature representation best preserves discriminative shape information.",
      dataset:
        "A balanced dataset of 10 handwritten symbol classes: +, 3, alpha, cos, div, f, ldots, lim, q, and right arrow. Every image was converted to grayscale, resized to 64 x 64 pixels, and split 80%/20% into training and test sets.",
      approach:
        "Generated three standardized feature representations: flattened raw pixels, Histogram of Oriented Gradients for edge and shape information, and Local Binary Patterns for local texture. Each representation was evaluated with the same two classifiers.",
      models:
        "An RBF-kernel Support Vector Machine with C = 10 and gamma = scale, plus a Multi-Layer Perceptron with 128- and 64-unit hidden layers, ReLU activations, Adam optimization, and up to 50 iterations.",
      evaluation:
        "Compared held-out test accuracy for all six classifier-feature combinations and inspected the best model's confusion matrix and sample predictions for class-specific errors.",
      results:
        "HOG produced the strongest results: 99.3% accuracy with SVM and 98.5% with MLP. Raw pixels reached 96.1% and 95.7%, while LBP fell to 61.2% and 59.1%. The SVM-HOG confusion matrix was nearly diagonal, with only a few errors among visually similar symbols such as + and f.",
      learned:
        "For small visual datasets, task-aligned feature engineering can outperform greater model complexity. HOG captured the structural information needed for symbol recognition, while texture-focused LBP discarded too much of the shape signal."
    }
  },
  {
    title: "Cardiovascular Disease Prediction",
    summary:
      "Cleaned and engineered features from approximately 56,000 anonymized health records, compared five classifiers, and selected a tuned Random Forest with an F1 score of 0.7316 and ROC-AUC of approximately 0.804.",
    long_description:
      "An end-to-end healthcare analytics project covering exploratory analysis, data cleaning, feature engineering, model comparison, hyperparameter tuning, and interpretable evaluation. The final Random Forest model was selected from five supervised classifiers and applied to an unseen test set.",
    year: "2025",
    category: "Data Analytics / Machine Learning",
    gallery_images: [
      "/projects/cardiovascular-model-comparison.png",
      "/projects/cardiovascular-feature-importance.png",
      "/projects/cardiovascular-random-forest-confusion-matrix.png",
      "/projects/cardiovascular-random-forest-roc.png"
    ],
    techStack: ["Python", "Pandas", "Scikit-learn", "Seaborn", "GridSearchCV"],
    tags: ["Data Analytics", "Healthcare", "Machine Learning", "Feature Engineering"],
    icon: "healthcare",
    caseStudy: {
      problem:
        "Predict whether an individual has cardiovascular disease from anonymized examination records while keeping the workflow reproducible and the final model interpretable.",
      dataset:
        "Approximately 56,000 records with 13 attributes, including age, gender, height, weight, systolic and diastolic blood pressure, cholesterol, glucose, smoking, alcohol use, physical activity, and the binary cardio target. Cleaning retained roughly 50,000 valid records.",
      approach:
        "Converted age from days to years, standardized categorical and binary fields, removed physiologically implausible blood pressure and body-measurement values, engineered BMI, filtered extreme BMI values, standardized numerical features, and used a 70/30 train-validation split.",
      models:
        "Logistic Regression, Decision Tree, Random Forest, K-Nearest Neighbors, and Support Vector Machine. Random Forest hyperparameters were tuned with GridSearchCV and 5-fold cross-validation.",
      evaluation:
        "Compared accuracy, validation F1, 5-fold cross-validation F1, ROC-AUC, confusion matrices, and ROC curves under the same preprocessing and validation conditions.",
      results:
        "Random Forest delivered the strongest overall result with validation F1 = 0.7316, CV F1 mean = 0.7305, and ROC-AUC approximately 0.804. Feature importance identified systolic blood pressure as the strongest predictor, followed by diastolic blood pressure, age, cholesterol, and BMI. The final Kaggle submission achieved a public score of 0.62542.",
      learned:
        "The project reinforced that data quality and feature engineering can matter as much as algorithm choice. It also highlighted the importance of cross-validation, threshold-aware metrics, and interpretable outputs when communicating healthcare models."
    }
  },
  {
    title: "SMS Spam Classification",
    summary:
      "Built a TF-IDF text-classification pipeline for 5,572 SMS messages and compared Perceptron with Multinomial Naive Bayes using stratified 5-fold cross-validation; Perceptron achieved a mean F1 score of 0.9147.",
    long_description:
      "An end-to-end natural language processing project for classifying SMS messages as spam or ham. The workflow combines TF-IDF feature extraction, imbalance-aware cross-validation, model comparison, and a small set of realistic message tests.",
    year: "2025",
    category: "Natural Language Processing",
    gallery_images: [
      "/projects/sms-class-distribution.png",
      "/projects/sms-model-comparison.png"
    ],
    techStack: ["Python", "Pandas", "Scikit-learn", "TF-IDF", "StratifiedKFold"],
    tags: ["NLP", "Text Classification", "TF-IDF", "Model Evaluation"],
    icon: "nlp",
    caseStudy: {
      problem:
        "Classify SMS messages as spam or ham with a reproducible text pipeline while accounting for class imbalance and the practical cost of incorrectly filtering legitimate messages.",
      dataset:
        "The UCI SMS Spam Collection contains 5,572 labeled messages: 4,825 ham messages (86.6%) and 747 spam messages (13.4%). Labels were encoded as ham = 0 and spam = 1.",
      approach:
        "Converted text into TF-IDF vectors using English stop-word removal, unigram and bigram features, a 10,000-feature limit, and sublinear term-frequency scaling. Each classifier was wrapped in a scikit-learn Pipeline and evaluated with shuffled Stratified 5-Fold cross-validation.",
      models:
        "Perceptron (max_iter = 1000, tol = 1e-3, random_state = 42) and Multinomial Naive Bayes.",
      evaluation:
        "Compared mean accuracy, precision, recall, and F1 across five stratified folds, with particular attention to precision-recall trade-offs caused by the imbalanced label distribution.",
      results:
        "Perceptron achieved mean accuracy = 0.9772, precision = 0.9190, recall = 0.9116, and F1 = 0.9147. Naive Bayes achieved accuracy = 0.9690 and perfect precision = 1.0000, but lower recall = 0.7684 and F1 = 0.8687. Perceptron provided the stronger overall balance, while both models correctly classified all five small-scale test messages.",
      learned:
        "The project demonstrated why accuracy alone can be misleading for imbalanced text data. Stratified evaluation and precision-recall analysis made the trade-off clear: Naive Bayes was highly conservative about flagging spam, while Perceptron recovered substantially more spam with a better overall F1 score."
    }
  },
  {
    title: "Smart Retail Checkout System",
    summary:
      "Built as a three-member group project, this smart checkout prototype combines 200-SKU YOLO detection with a Django workflow for mobile capture, human review, billing, receipts, and checkout history.",
    long_description:
      "A three-member group project that connects real-time product detection to a usable retail checkout workflow. The team prepared a large checkout-scene dataset, compared three lightweight YOLO detectors, and integrated the selected model into a responsive Django application with desktop and mobile input, editable billing, receipts, and history management.",
    year: "2026",
    category: "Computer Vision / Deep Learning / Group Project",
    gallery_images: [
      "/projects/smart-retail-model-comparison.png",
      "/projects/smart-retail-system-architecture.png",
      "/projects/smart-retail-checkout-review.png",
      "/projects/smart-retail-mobile-capture.png",
      "/projects/smart-retail-detection-results.png"
    ],
    sort_order: 4,
    techStack: ["Python", "Ultralytics YOLO", "Django", "AWS SageMaker", "COCO / YOLO"],
    tags: ["Group Project", "Deep Learning", "Object Detection", "Human-in-the-loop"],
    icon: "vision",
    caseStudy: {
      problem:
        "Recognize multiple SKU-level products in one checkout image and convert detections into a reliable, editable bill without allowing uncertain predictions to flow directly into payment decisions.",
      dataset:
        "The team repurposed the RPC val2019 checkout-scene subset into a closed-set dataset with 200 SKU classes across 17 product categories, 6,000 images, and 73,602 bounding boxes. Easy, Medium, and Hard scenes were stratified into an 80/10/10 train-validation-test split, producing 4,800 training, 600 validation, and 600 test images.",
      approach:
        "Converted COCO annotations into YOLO format, trained three lightweight detectors under shared settings, and mapped predictions to product names, quantities, prices, GST, and totals. The selected model was integrated into a layered Django system supporting local upload, demo images, mobile QR capture, low-confidence warnings, manual corrections, receipt generation, and checkout history.",
      models:
        "YOLOv5nu, YOLOv8n, and YOLOv8s were trained at 640 x 640 for up to 300 epochs with batch size 8 and early stopping patience 50 on an AWS SageMaker ml.g4dn.xlarge instance with an NVIDIA Tesla T4 GPU.",
      evaluation:
        "Compared precision, recall, mAP@0.5, mAP@0.5:0.95, a predefined weighted score, inference speed, convergence curves, precision-recall curves, F1-confidence curves, and qualitative checkout-scene predictions on the held-out test set.",
      results:
        "YOLOv8n was selected for deployment with precision = 0.99183, recall = 0.99476, mAP@0.5 = 0.99389, mAP@0.5:0.95 = 0.87068, and the highest weighted score of 0.93221. The Django prototype successfully connected image submission, SKU aggregation, editable bill review, receipt generation, and transaction history.",
      learned:
        "The group project showed that strong detection metrics are only one part of an operational ML system. Closed-set recognition, occlusion, visually similar packaging, and low-confidence predictions make human review and transparent correction controls essential for dependable checkout assistance."
    }
  },
  {
    title: "Hybrid Sparse-Dense Retrieval for RAG",
    summary:
      "Evaluated BM25, dense retrieval, and Hybrid RRF in a four-member group project across 10,570 SQuAD questions; Hybrid RRF led every main metric with Recall@10 = 0.9305 and MRR = 0.7574.",
    long_description:
      "A four-member group project investigating retrieval quality as a bottleneck in Retrieval-Augmented Generation systems. The study combines lexical and semantic retrieval through Reciprocal Rank Fusion, then tests retrieval methods, chunk sizes, embedding models, efficiency trade-offs, and per-question failure patterns.",
    year: "2026",
    category: "Natural Language Processing / Group Project",
    gallery_images: [
      "/projects/rag-retrieval-comparison.png",
      "/projects/rag-chunking-comparison.png",
      "/projects/rag-embedding-model-comparison.png",
      "/projects/rag-error-analysis.png"
    ],
    sort_order: 5,
    techStack: ["Python", "FAISS", "Sentence Transformers", "BM25", "Hugging Face"],
    tags: ["Group Project", "RAG", "Information Retrieval", "NLP"],
    icon: "nlp",
    caseStudy: {
      problem:
        "Improve the document-retrieval stage of a RAG pipeline, where lexical mismatch can cause BM25 to miss semantically relevant documents and dense retrieval can overlook useful exact-term signals.",
      dataset:
        "The main experiment used the complete SQuAD v1.1 validation set: 10,570 questions mapped to 2,067 unique context documents. Chunking, embedding-model comparison, and per-question error analysis used reproducible 2,000-question subsets for computational efficiency.",
      approach:
        "Built a BM25 lexical baseline and a dense FAISS index using normalized sentence-transformer embeddings. Hybrid retrieval fused the top 50 candidates from both rankers with Reciprocal Rank Fusion using k = 60. Additional experiments compared 100-, 200-, and 400-word chunks, three embedding models, and method-specific failure cases.",
      models:
        "BM25Okapi, all-MiniLM-L6-v2 dense retrieval, and Hybrid BM25-Dense RRF formed the main comparison. The embedding study additionally evaluated all-mpnet-base-v2 and BAAI bge-small-en-v1.5.",
      evaluation:
        "Measured Recall@1, Recall@3, Recall@5, Recall@10, and Mean Reciprocal Rank. Secondary experiments compared corpus encoding time, embedding dimensionality, chunk-count trade-offs, and per-question top-10 retrieval outcomes.",
      results:
        "On the full validation set, Hybrid RRF achieved Recall@1 = 0.6700, Recall@5 = 0.8749, Recall@10 = 0.9305, and MRR = 0.7574, leading both BM25 and dense retrieval on every main metric. On the 2,000-question embedding subset, bge-small produced the best Recall@1 and MRR, while mpnet-base achieved the highest Recall@10 at substantially greater encoding cost.",
      learned:
        "Sparse and dense signals were complementary, but the error analysis also showed that fusion is not automatically best for every subset or cutoff. Retrieval conclusions should therefore state the evaluation population clearly and balance aggregate metrics with question-level failure analysis and computational cost."
    }
  },
  {
    title: "Kitty & Puppy Park",
    slug: "kitty-puppy-park",
    summary:
      "Extended a Unity 2D maze-game assignment with a five-minute survival mode, score-triggered power-ups and custom pixel art.",
    long_description:
      "A Unity 2D and C# personal project extending a university PacStudent maze-game assignment. I developed a classic collection level and a five-minute survival challenge with escalating pursuit, score-triggered power-ups and custom pixel art.",
    category: "Game Development / Personal Project",
    techStack: ["Unity 2D", "C#", "Piskel", "Pixel Animation", "WebGL"],
    tags: ["Personal Project", "Unity 2D", "C#", "Pixel Art", "WebGL"],
    icon: "game",
    video: {
      src: "/videos/kitty-puppy-park/gameplay.mp4",
      poster: "/projects/kitty-puppy-park/menu.webp",
      title: "Menu and survival gameplay",
      description: "Recorded demonstration of the main menu and survival level, including enemy reinforcements and power-ups. Original game music and sound effects are retained in the video."
    },
    figures: [
      {
        src: "/projects/kitty-puppy-park/survival.webp",
        title: "Five-minute survival challenge",
        alt: "Pixel-art survival maze with the cat, pursuing dogs, food, a score display, lives and a countdown timer.",
        caption: "The second level uses a larger custom maze, one starting life, replenishing food and score-triggered power-ups. Enemy reinforcements increase pressure as the round progresses.",
        width: 1280,
        height: 720
      },
      {
        src: "/projects/kitty-puppy-park/power-ups.webp",
        title: "Counterplay under increasing pressure",
        alt: "A later survival-game frame with more pursuing dogs and visible laser, fish and freeze timers in the HUD.",
        caption: "Lasers, radial shots, freeze and extra lives give the player ways to respond. Movement and music accelerate, while survival and power-up durations remain fixed.",
        width: 1280,
        height: 720
      }
    ],
    caseStudy: {
      problem:
        "Extend a classic maze-collection exercise into a survival game where the player can plan routes, take risks for score and use earned tools to create room to escape.",
      dataset: "",
      gameplay:
        "The classic level combines food collection, pursuing dogs and temporary fish-powered counterattacks. The survival level lasts five minutes: dogs continually reinforce from the centre and return after defeat. Scoring earns persistent power-up pickups, creating a collection-risk-counterattack loop.",
      approach:
        "Implemented grid movement, directional animation and enemy chase, fear, defeat-return and respawn states. Built generated and manually arranged mazes, including periodically changing passages with advance warnings. Created pixel assets and frame-by-frame animations in Piskel.",
      models: "",
      evaluation:
        "Playtesting showed that long corridors and sparse supplies made survival too passive. Added bypass routes and more food, tied strong item spawns to score, and removed pickup expiry. Moved spawn/respawn to the upper-left area and added respawn protection to reduce unpredictable failures.",
      results:
        "Completed menus, level selection, countdowns, game-over screens, saved high scores, retry and menu-return flows, plus a WebGL demo export. Combat includes wall-blocked lasers, wall-piercing radial shots, temporary freeze and extra lives. Food respawns after collection and fish refreshes at random positions.",
      contribution:
        "I designed the gameplay and levels, created pixel assets, assembled Unity scenes and organised playtest feedback. AI supported parts of code implementation, troubleshooting and tool operations.",
      credits:
        "Music and some sound effects use third-party licensed resources. Their sources and attribution are retained in the game project; the demonstration preserves that original soundtrack.",
      learned:
        "Adding mechanics alone did not improve the experience. Movement speed, escape routes, replenishment and recovery after failure needed to be tuned together so the challenge applied pressure while leaving players meaningful responses."
    }
  }
];

export const skillGroups = [
  {
    title: "Data Analytics & BI",
    icon: Database,
    skills: [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Excel",
      "Tableau",
      "Data Cleaning",
      "Exploratory Data Analysis",
      "Matplotlib",
      "Seaborn"
    ]
  },
  {
    title: "Machine Learning & Evaluation",
    icon: BrainCircuit,
    skills: [
      "Scikit-learn",
      "XGBoost",
      "Feature Engineering",
      "Cross-validation",
      "Chronological Validation",
      "Match-level Bootstrap",
      "Calibration Diagnostics",
      "Error Analysis"
    ]
  },
  {
    title: "Deep Learning / Computer Vision",
    icon: Eye,
    skills: [
      "PyTorch",
      "TorchVision",
      "ResNet18",
      "Faster R-CNN",
      "SSD300",
      "OpenCV",
      "Object Detection",
      "Image Classification"
    ]
  },
  {
    title: "Tools & Languages",
    icon: Code2,
    skills: [
      "React",
      "TypeScript",
      "FastAPI",
      "OpenAI API Integration",
      "Git / GitHub",
      "Linux / Unix",
      "Jupyter / Colab",
      "English",
      "Mandarin Chinese"
    ]
  }
];

export const education = [
  {
    school: "University of Technology Sydney",
    degree: "Master of Information Technology",
    period: "2025 - Present",
    coursework: [
      "Database",
      "Data Analytics",
      "Advanced Data Analytics Algorithms",
      "Project Management",
      "Software Development"
    ]
  },
  {
    school: "Huazhong Agricultural University",
    degree: "Bachelor of Biotechnology",
    period: "2019 - 2023",
    coursework: [
      "Microbiology",
      "Cell Biology",
      "Genetics",
      "Biochemistry",
      "Genetic Engineering",
      "Pharmacology"
    ]
  }
];

export const workflowSteps = [
  "Data Preparation",
  "Feature Engineering",
  "Modeling",
  "Evaluation",
  "Error Analysis"
];

export const focusAreas = [
  "Data Analytics",
  "Applied Machine Learning",
  "Data Preparation",
  "Exploratory Analysis",
  "Computer Vision",
  "Model Evaluation"
];

export const quickStats = [
  { label: "Current degree", value: "MIT at UTS", icon: GraduationCap },
  { label: "Main focus", value: "Data Analytics", icon: BrainCircuit },
  { label: "Workflow mindset", value: "End to end", icon: Workflow },
  { label: "Location", value: "Sydney", icon: ChartNoAxesCombined }
];
