<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 15:29
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Offer
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="MessageContent,Offer")
 */
class Offer implements OfferInterface
{
    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var ServiceInterface
     *
     * @OGM\ManyToOne(relation="of_service")
     */
    private $serviceOffered;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $quotedPriceTotal;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $quotedPricePrepayment;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return ServiceInterface
     */
    public function getServiceOffered()
    {
        return $this->serviceOffered;
    }

    /**
     * @return int
     */
    public function getQuotedPriceTotal()
    {
        return $this->quotedPriceTotal;
    }

    /**
     * @return int
     */
    public function getQuotedPricePrepayment()
    {
        return $this->quotedPricePrepayment;
    }

    /**
     * @param int $id
     * @return Offer
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param ServiceInterface $serviceOffered
     * @return Offer
     */
    public function setServiceOffered($serviceOffered)
    {
        $this->serviceOffered = $serviceOffered;
        return $this;
    }

    /**
     * @param int $quotedPriceTotal
     * @return Offer
     */
    public function setQuotedPriceTotal($quotedPriceTotal)
    {
        $this->quotedPriceTotal = $quotedPriceTotal;
        return $this;
    }

    /**
     * @param int $quotedPricePrepayment
     * @return Offer
     */
    public function setQuotedPricePrepayment($quotedPricePrepayment)
    {
        $this->quotedPricePrepayment = $quotedPricePrepayment;
        return $this;
    }


    /**
     * @return Offer
     */
    public static function create(){
        return new Offer();
    }
}