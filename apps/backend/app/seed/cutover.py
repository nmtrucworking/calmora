# ruff: noqa: E501
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any

CUTOVER_VERSION = "fe-cutover-2026-07"

_VISIBLE_CONTENT: dict[str, dict[str, Any]] = {
    "classic": {
        "eyebrow": "QR Senova Classic / Giữ",
        "title": "Giữ một khoảng lặng mỗi ngày.",
        "lede": "Classic là điểm bắt đầu của Senova: một phần trà hương sen gọn, dễ pha và đủ chậm để hương sen tiếp tục hiện diện trong đời sống thường ngày.",
        "story": {
            "title": "Câu chuyện phía sau",
            "paragraphs": [
                "Giữ một giá trị không có nghĩa là giữ nguyên mọi hình thức cũ. Classic tạo một điểm tiếp cận đơn giản để người dùng bắt đầu nhận biết hương sen, vị trà và khoảng lặng của việc thưởng thức.",
                "Một phần trà, một chiếc cốc và vài phút được dành riêng đã đủ để biến việc pha trà thành một nhịp nghỉ có chủ đích.",
            ],
        },
        "guidance": {
            "title": "Cách bắt đầu",
            "intro": "Dành cho một tách trà hằng ngày, không cần chuẩn bị cầu kỳ.",
            "steps": [
                {
                    "label": "01",
                    "title": "Mở một phần trà",
                    "text": "Lấy một phần trà đã định lượng, giữ thao tác gọn và sạch trước khi pha.",
                },
                {
                    "label": "02",
                    "title": "Pha bằng nước nóng",
                    "text": "Dùng khoảng 180 ml nước nóng và làm theo hướng dẫn in trên bao bì của đúng phiên bản sản phẩm.",
                },
                {
                    "label": "03",
                    "title": "Chờ hương sen mở",
                    "text": "Chờ 4-5 phút để hương và vị dần ổn định trước khi thưởng thức.",
                },
                {
                    "label": "04",
                    "title": "Giữ một khoảng chậm",
                    "text": "Thưởng thức trong một khoảng nghỉ ít bị gián đoạn, rồi ghi lại cảm nhận nếu có thể.",
                },
            ],
        },
        "reflectionPrompt": "Hôm nay, bạn muốn dành tách trà này cho chính mình hay mời một người khác ngồi lại?",
    },
    "petal-pack": {
        "eyebrow": "QR Senova Petal Pack / Mở",
        "title": "Mở một cánh sen, bắt đầu một khoảng lặng.",
        "lede": "Petal Pack là phần trà cho một lần pha, đặt trong túi lọc và được bao quanh bởi cánh sen sấy tạo hình búp sen.",
        "story": {
            "title": "Ý nghĩa của trải nghiệm",
            "paragraphs": [
                "Petal Pack không mô phỏng một nghi lễ lịch sử cụ thể. Đây là nghi thức trải nghiệm do Senova thiết kế để người dùng chủ động bước ra khỏi nhịp vội và bắt đầu thưởng trà.",
                "Văn hóa không chỉ được hiểu bằng thông tin. Nó còn được ghi nhớ qua hình dáng, mùi hương, thao tác và cảm giác.",
            ],
        },
        "guidance": {
            "title": "Mở - cảm nhận - pha",
            "intro": "Hãy để thao tác mở cánh trở thành bước đầu tiên của tách trà.",
            "steps": [
                {
                    "label": "01",
                    "title": "Mở nhẹ từng lớp cánh",
                    "text": "Không cần vội lấy phần trà; hãy quan sát cấu trúc búp sen và cảm nhận chất liệu trước.",
                },
                {
                    "label": "02",
                    "title": "Cảm nhận bằng nhiều giác quan",
                    "text": "Nhận biết hình dáng, chất liệu và hương trong khoảnh khắc đầu tiên.",
                },
                {
                    "label": "03",
                    "title": "Pha nguyên búp sen",
                    "text": "Đặt nguyên búp sen vào dụng cụ pha và rót nước theo thông số đang hiển thị.",
                },
                {
                    "label": "04",
                    "title": "Chờ rồi thưởng thức",
                    "text": "Chờ khoảng 5 phút để hương vị hiện ra, quan sát màu nước và ghi lại điều khiến bạn nhớ nhất.",
                },
            ],
        },
        "reflectionPrompt": "Điều khiến bạn nhớ nhất là hình dáng búp sen, thao tác mở cánh, hương trà hay khoảng thời gian chờ?",
    },
    "gift-set": {
        "eyebrow": "QR Senova Gift Set / Trao",
        "title": "Một món quà có câu chuyện.",
        "lede": "Gift Set kết hợp trà hương sen, Petal Pack, hướng dẫn pha và thẻ câu chuyện trong một hành trình trao tặng thống nhất.",
        "story": {
            "title": "Giữ - Mở - Trao",
            "paragraphs": [
                "Bạn nhận được Senova Gift Set không chỉ như một hộp trà, mà như một lời mời dành thời gian cho hương sen, cho chính mình và cho người đã chuẩn bị món quà.",
                "Điều được trao đi không chỉ là sản phẩm, mà còn là thời gian chuẩn bị, sự lựa chọn có chủ đích và một lời trân trọng.",
            ],
        },
        "guidance": {
            "title": "Bắt đầu từ đâu?",
            "intro": "Mỗi thành phần trong Gift Set đảm nhiệm một vai trò trong hành trình nhận quà.",
            "steps": [
                {
                    "label": "01",
                    "title": "Đọc lời nhắn",
                    "text": "Bắt đầu bằng thông điệp đi cùng bộ quà để nhận biết dụng ý của người trao.",
                },
                {
                    "label": "02",
                    "title": "Chọn trải nghiệm",
                    "text": "Chọn Classic khi bạn muốn một tách trà gọn và quen thuộc; chọn Petal Pack khi muốn bắt đầu bằng thao tác mở cánh.",
                },
                {
                    "label": "03",
                    "title": "Pha theo hướng dẫn",
                    "text": "Dùng hướng dẫn in trên bao bì hoặc thẻ đi kèm để pha đúng phần trà bạn chọn.",
                },
                {
                    "label": "04",
                    "title": "Tiếp tục câu chuyện",
                    "text": "Sau khi thưởng thức, bạn có thể gửi phản hồi hoặc kể lại ý nghĩa món quà cho một người khác.",
                },
            ],
        },
        "reflectionPrompt": "Món quà này phù hợp nhất với dịp trao tặng nào, và điều gì làm người nhận nhớ đến nó?",
    },
}


def build_cutover_contents(seed_dir: Path) -> list[dict[str, Any]]:
    original = json.loads((seed_dir / "qr_experience_content.json").read_text(encoding="utf-8"))
    by_product = {
        item["productSlug"]: item
        for item in original
        if item.get("version") == "v1" and item.get("locale", "vi") == "vi"
    }
    result: list[dict[str, Any]] = []
    for product, visible in _VISIBLE_CONTENT.items():
        content = deepcopy(by_product[product])
        content.update(deepcopy(visible))
        content["version"] = CUTOVER_VERSION
        result.append(content)
    return result


def build_cutover_override(seed_dir: Path) -> dict[str, Any]:
    overrides = json.loads((seed_dir / "qr_batch_overrides.json").read_text(encoding="utf-8"))
    source = next(item for item in overrides if item["batchCode"] == "PP-2601-A" and item["contentVersion"] == "v1")
    result = deepcopy(source)
    result["contentVersion"] = CUTOVER_VERSION
    return result
